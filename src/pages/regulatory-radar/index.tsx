import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Radar, Shield, AlertTriangle, Clock, TrendingUp, FileDown, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useRegulatoryRadar } from './hooks/useRegulatoryRadar';
import { AgentStatusCards } from './components/AgentStatus';
import { AlertFeed } from './components/AlertFeed';
import { ScanButton } from './components/ScanButton';
import { ScanHistory } from './components/ScanHistory';
import { DEMO_ALERTS, DEMO_AGENT_STATUSES } from './data/demoData';
import { generateRegulatoryReport } from '@/lib/generateRegulatoryReport';
import type { ClassifiedAlert } from './api/classifier';
import type { SourceStatus } from './hooks/useRegulatoryRadar';

export default function RegulatoryRadar() {
  const {
    startScan,
    stopScan,
    isScanning,
    scanPhase,
    agentStatuses,
    alerts,
    lastResult,
    insertAlertToSupabase,
  } = useRegulatoryRadar();

  const queryClient = useQueryClient();
  const [demoMode, setDemoMode] = useState(false);
  const [demoAlerts, setDemoAlerts] = useState<ClassifiedAlert[]>([]);
  const [demoStatuses, setDemoStatuses] = useState<Record<string, SourceStatus> | null>(null);

  const activeAlerts = demoMode ? demoAlerts : alerts;
  const activeStatuses = demoMode && demoStatuses ? demoStatuses : agentStatuses;

  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
  const majorCount = activeAlerts.filter((a) => a.severity === 'major').length;

  const runDemo = useCallback(async () => {
    setDemoMode(true);
    setDemoAlerts([]);
    setDemoStatuses(
      Object.fromEntries(
        Object.entries(DEMO_AGENT_STATUSES).map(([k, v]) => [
          k,
          { ...v, status: 'running' as const, message: 'Scanning...', alertCount: 0 },
        ])
      )
    );

    toast.info('Demo mode — simulating scan with realistic data...');

    // Phase 1 & 2: Simulate agents detecting + classifying one by one
    const sourceOrder = ['eur-lex', 'eu-ai-office', 'nist', 'nyc-ll144'] as const;
    for (let i = 0; i < sourceOrder.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      const sourceId = sourceOrder[i];
      const alert = DEMO_ALERTS[i];

      setDemoStatuses((prev) =>
        prev
          ? {
              ...prev,
              [sourceId]: { ...DEMO_AGENT_STATUSES[sourceId] },
            }
          : null
      );
      setDemoAlerts((prev) => [...prev, alert]);

      // Critical alert toast
      if (alert.severity === 'critical') {
        toast.error(`CRITICAL: ${alert.title}`, {
          description: alert.recommended_action,
          duration: 10000,
        });
      } else if (alert.severity === 'major') {
        toast.warning(`MAJOR: ${alert.title}`, {
          description: alert.recommended_action,
          duration: 8000,
        });
      }
    }

    // Phase 3: ENFORCE — Save demo alerts to Risk Register
    let savedCount = 0;
    for (const alert of DEMO_ALERTS) {
      try {
        await insertAlertToSupabase(alert);
        savedCount++;
      } catch {
        // Error already logged/toasted inside insertAlertToSupabase
      }
    }

    // Invalidate risks query so Risk Register page shows new entries
    queryClient.invalidateQueries({ queryKey: ['risks'] });

    if (savedCount > 0) {
      toast.success(`Demo scan complete — ${DEMO_ALERTS.length} alerts detected, ${savedCount} saved to Risk Register`);
    } else {
      toast.success('Demo scan complete — 4 alerts detected across 4 sources');
    }
  }, [insertAlertToSupabase, queryClient]);

  const handleExportPDF = useCallback(() => {
    if (activeAlerts.length === 0) {
      toast.error('No alerts to export. Run a scan first.');
      return;
    }

    generateRegulatoryReport({
      alerts: activeAlerts,
      scanDuration: lastResult?.duration ?? 4,
      sourcesScanned: 4,
      sourcesSucceeded: 4,
    });

    toast.success('PDF report downloaded');
  }, [activeAlerts, lastResult]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <motion.div
              animate={isScanning ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Radar className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">RegulatoryRadar</h1>
              <p className="text-sm text-muted-foreground">
                Autonomous AI compliance enforcement — powered by TinyFish
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={runDemo}
            disabled={isScanning}
            className="gap-1.5"
          >
            <Play className="h-3.5 w-3.5" />
            Demo Mode
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={activeAlerts.length === 0}
            className="gap-1.5"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export PDF
          </Button>
          <ScanButton
            isScanning={isScanning}
            scanPhase={scanPhase}
            onStart={() => {
              setDemoMode(false);
              setDemoAlerts([]);
              setDemoStatuses(null);
              startScan();
            }}
            onStop={stopScan}
          />
        </div>
      </div>

      {/* Demo mode indicator */}
      {demoMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm"
        >
          <Play className="h-4 w-4" />
          Demo mode active — showing simulated regulatory alerts. Click "Run Regulatory Scan" for live data.
        </motion.div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={Shield}
          label="Sources Monitored"
          value="4"
          sublabel="EUR-Lex, EU AI Office, NIST, NYC"
          color="text-primary"
        />
        <StatCard
          icon={AlertTriangle}
          label="Alerts Found"
          value={String(activeAlerts.length)}
          sublabel={
            criticalCount > 0
              ? `${criticalCount} critical, ${majorCount} major`
              : 'No critical alerts'
          }
          color={criticalCount > 0 ? 'text-red-400' : 'text-muted-foreground'}
        />
        <StatCard
          icon={Clock}
          label="Last Scan"
          value={lastResult ? `${lastResult.duration}s` : demoMode ? '4s' : '--'}
          sublabel={
            lastResult
              ? lastResult.timestamp.toLocaleTimeString()
              : demoMode
              ? 'Demo scan'
              : 'No scan yet'
          }
          color="text-muted-foreground"
        />
        <StatCard
          icon={TrendingUp}
          label="Success Rate"
          value={
            lastResult
              ? `${Math.round((lastResult.sourcesSucceeded / lastResult.sourcesScanned) * 100)}%`
              : demoMode
              ? '100%'
              : '--'
          }
          sublabel={
            lastResult
              ? `${lastResult.sourcesSucceeded}/${lastResult.sourcesScanned} sources`
              : demoMode
              ? '4/4 sources'
              : 'Run scan to see'
          }
          color="text-green-400"
        />
      </div>

      {/* Agent Status Cards */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Agent Status
        </h2>
        <AgentStatusCards statuses={activeStatuses} />
      </div>

      {/* Alert Feed + Scan History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertFeed alerts={activeAlerts} isScanning={isScanning} />
        <ScanHistory />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sublabel: string;
  color: string;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-xs text-muted-foreground font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      </CardContent>
    </Card>
  );
}
