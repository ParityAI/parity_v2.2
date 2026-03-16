import { motion } from 'framer-motion';
import { Radar, Shield, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRegulatoryRadar } from './hooks/useRegulatoryRadar';
import { AgentStatusCards } from './components/AgentStatus';
import { AlertFeed } from './components/AlertFeed';
import { ScanButton } from './components/ScanButton';
import { ScanHistory } from './components/ScanHistory';

export default function RegulatoryRadar() {
  const {
    startScan,
    stopScan,
    isScanning,
    scanPhase,
    agentStatuses,
    alerts,
    lastResult,
  } = useRegulatoryRadar();

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const majorCount = alerts.filter((a) => a.severity === 'major').length;

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

        <ScanButton
          isScanning={isScanning}
          scanPhase={scanPhase}
          onStart={startScan}
          onStop={stopScan}
        />
      </div>

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
          value={String(alerts.length)}
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
          value={lastResult ? `${lastResult.duration}s` : '--'}
          sublabel={lastResult ? lastResult.timestamp.toLocaleTimeString() : 'No scan yet'}
          color="text-muted-foreground"
        />
        <StatCard
          icon={TrendingUp}
          label="Success Rate"
          value={
            lastResult
              ? `${Math.round((lastResult.sourcesSucceeded / lastResult.sourcesScanned) * 100)}%`
              : '--'
          }
          sublabel={
            lastResult
              ? `${lastResult.sourcesSucceeded}/${lastResult.sourcesScanned} sources`
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
        <AgentStatusCards statuses={agentStatuses} />
      </div>

      {/* Alert Feed + Scan History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertFeed alerts={alerts} isScanning={isScanning} />
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
