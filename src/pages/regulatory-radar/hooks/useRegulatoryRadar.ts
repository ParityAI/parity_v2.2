import { useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { runAllAgents, REGULATORY_SOURCES, type AgentStatusUpdate } from '../api/tinyfish';
import { classifyAllResults, type ClassifiedAlert } from '../api/classifier';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'error';

export interface SourceStatus {
  id: string;
  name: string;
  status: AgentStatus;
  message: string;
  alertCount: number;
}

export interface ScanResult {
  alerts: ClassifiedAlert[];
  timestamp: Date;
  duration: number;
  sourcesScanned: number;
  sourcesSucceeded: number;
}

export function useRegulatoryRadar() {
  const queryClient = useQueryClient();
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState<'idle' | 'detecting' | 'classifying' | 'saving'>('idle');
  const [alerts, setAlerts] = useState<ClassifiedAlert[]>([]);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const abortRef = useRef(false);

  const [agentStatuses, setAgentStatuses] = useState<Record<string, SourceStatus>>(() => {
    const initial: Record<string, SourceStatus> = {};
    for (const source of REGULATORY_SOURCES) {
      initial[source.id] = {
        id: source.id,
        name: source.name,
        status: 'idle',
        message: 'Ready',
        alertCount: 0,
      };
    }
    return initial;
  });

  const updateSourceStatus = useCallback(
    (sourceId: string, updates: Partial<SourceStatus>) => {
      setAgentStatuses((prev) => ({
        ...prev,
        [sourceId]: { ...prev[sourceId], ...updates },
      }));
    },
    []
  );

  const resetStatuses = useCallback(() => {
    setAgentStatuses((prev) => {
      const reset: Record<string, SourceStatus> = {};
      for (const key of Object.keys(prev)) {
        reset[key] = { ...prev[key], status: 'idle', message: 'Ready', alertCount: 0 };
      }
      return reset;
    });
    setAlerts([]);
    setScanPhase('idle');
  }, []);

  const insertAlertToSupabase = useCallback(async (alert: ClassifiedAlert) => {
    // Get user's organization_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .single();

    if (profileError || !profile?.organization_id) {
      console.error('Failed to get organization_id:', profileError);
      toast.error('Cannot save to Risk Register — no organization found. Please ensure your profile is set up.');
      throw new Error('No organization_id found');
    }

    // Build the full risk payload with RegulatoryRadar-specific columns
    const riskPayload = {
      title: alert.title,
      description: `${alert.description}${alert.recommended_action ? `\n\nRecommended Action: ${alert.recommended_action}` : ''}${alert.source ? `\n\nSource: ${alert.source}` : ''}${alert.regulation ? ` | Regulation: ${alert.regulation}` : ''}`,
      severity: alert.severity,
      category: alert.category || 'regulatory',
      mitigation_status: 'not_started' as const,
      likelihood: (alert.severity === 'critical' ? 'very_high' : alert.severity === 'major' ? 'high' : 'medium') as const,
      organization_id: profile.organization_id,
      identified_date: alert.date || new Date().toISOString().split('T')[0],
      source: alert.source,
      regulation: alert.regulation,
      affected_framework: alert.affected_framework,
      recommended_action: alert.recommended_action,
      auto_generated: true,
    };

    const { error } = await supabase.from('risks').insert(riskPayload);

    if (error) {
      // If the new columns don't exist yet, retry with only core fields
      if (error.message?.includes('column') || error.code === '42703') {
        console.warn('RegulatoryRadar columns not found, inserting with core fields only');
        const { error: fallbackError } = await supabase.from('risks').insert({
          title: riskPayload.title,
          description: riskPayload.description,
          severity: riskPayload.severity,
          category: riskPayload.category,
          mitigation_status: riskPayload.mitigation_status,
          likelihood: riskPayload.likelihood,
          organization_id: riskPayload.organization_id,
          identified_date: riskPayload.identified_date,
        });
        if (fallbackError) {
          console.error('Fallback insert also failed:', fallbackError.message);
          toast.error(`Failed to save risk: ${fallbackError.message}`);
          throw fallbackError;
        }
        return; // fallback succeeded
      }

      console.error('Failed to insert risk:', error.message, error.details);
      toast.error(`Failed to save risk: ${error.message}`);
      throw error;
    }
  }, []);

  const startScan = useCallback(async () => {
    const tinyfishKey = import.meta.env.VITE_TINYFISH_API_KEY;
    const fireworksKey = import.meta.env.VITE_FIREWORKS_API_KEY;

    if (!tinyfishKey || tinyfishKey === 'your_tinyfish_key') {
      toast.error('TinyFish API key not configured. Add VITE_TINYFISH_API_KEY to .env.local');
      return;
    }
    if (!fireworksKey || fireworksKey === 'your_fireworks_key') {
      toast.error('Fireworks API key not configured. Add VITE_FIREWORKS_API_KEY to .env.local');
      return;
    }

    abortRef.current = false;
    setIsScanning(true);
    resetStatuses();
    setScanPhase('detecting');

    const startTime = Date.now();
    let allAlerts: ClassifiedAlert[] = [];

    toast.info('RegulatoryRadar scan started — 4 agents deploying...');

    try {
      // Phase 1: DETECT — Run TinyFish agents in parallel
      const handleStatus = (update: AgentStatusUpdate) => {
        updateSourceStatus(update.sourceId, {
          status: update.status === 'running' ? 'running' : update.status === 'completed' ? 'completed' : update.status === 'error' ? 'error' : 'idle',
          message: update.message || '',
        });
      };

      const agentResults = await runAllAgents(tinyfishKey, handleStatus);

      if (abortRef.current) return;

      const successfulResults = agentResults
        .filter((r) => r.status === 'completed' && r.data)
        .map((r) => ({ sourceName: r.sourceName, data: r.data! }));

      const failedCount = agentResults.filter((r) => r.status === 'error').length;
      if (failedCount > 0) {
        toast.warning(`${failedCount} source(s) failed to scan`);
      }

      if (successfulResults.length === 0) {
        toast.error('All agents failed — no data to classify');
        setIsScanning(false);
        setScanPhase('idle');
        return;
      }

      // Phase 2: CLASSIFY — Pipe through Fireworks AI
      setScanPhase('classifying');

      allAlerts = await classifyAllResults(
        successfulResults,
        fireworksKey,
        (sourceName, sourceAlerts) => {
          // Update alert count per source
          const sourceId = REGULATORY_SOURCES.find((s) => s.name === sourceName)?.id;
          if (sourceId) {
            updateSourceStatus(sourceId, { alertCount: sourceAlerts.length });
          }
          // Stream alerts into UI as they arrive
          setAlerts((prev) => [...prev, ...sourceAlerts]);
        }
      );

      if (abortRef.current) return;

      // Phase 3: ENFORCE — Save to Supabase
      setScanPhase('saving');
      let savedCount = 0;

      for (const alert of allAlerts) {
        try {
          await insertAlertToSupabase(alert);
          savedCount++;
        } catch {
          console.error(`Failed to save alert: ${alert.title}`);
        }
      }

      // Invalidate risks query so Risk Register updates
      queryClient.invalidateQueries({ queryKey: ['risks'] });

      const duration = Math.round((Date.now() - startTime) / 1000);
      const result: ScanResult = {
        alerts: allAlerts,
        timestamp: new Date(),
        duration,
        sourcesScanned: agentResults.length,
        sourcesSucceeded: successfulResults.length,
      };
      setLastResult(result);

      // Show critical alerts as individual toasts
      const criticalAlerts = allAlerts.filter((a) => a.severity === 'critical');
      for (const alert of criticalAlerts) {
        toast.error(`CRITICAL: ${alert.title}`, {
          description: alert.recommended_action,
          duration: 10000,
        });
      }

      toast.success(
        `Scan complete — ${allAlerts.length} alerts found, ${savedCount} saved to Risk Register (${duration}s)`
      );
    } catch (error) {
      console.error('Scan failed:', error);
      toast.error('Scan failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsScanning(false);
      setScanPhase('idle');
    }
  }, [queryClient, resetStatuses, updateSourceStatus, insertAlertToSupabase]);

  const stopScan = useCallback(() => {
    abortRef.current = true;
    setIsScanning(false);
    setScanPhase('idle');
    toast.info('Scan stopped');
  }, []);

  return {
    startScan,
    stopScan,
    isScanning,
    scanPhase,
    agentStatuses,
    alerts,
    lastResult,
    insertAlertToSupabase,
  };
}
