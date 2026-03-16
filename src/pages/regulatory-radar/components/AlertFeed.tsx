import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  ExternalLink,
  Shield,
  FileText,
  Zap,
  Info,
} from 'lucide-react';
import type { ClassifiedAlert } from '../api/classifier';

const severityConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ElementType }
> = {
  critical: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: Zap,
  },
  major: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: AlertTriangle,
  },
  moderate: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: Shield,
  },
  minor: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: Info,
  },
  negligible: {
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    icon: FileText,
  },
};

interface AlertFeedProps {
  alerts: ClassifiedAlert[];
  isScanning: boolean;
}

export function AlertFeed({ alerts, isScanning }: AlertFeedProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Live Alert Feed
            {alerts.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {alerts.length}
              </Badge>
            )}
          </CardTitle>
          {isScanning && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Badge variant="outline" className="text-xs border-red-500/50 text-red-400">
                LIVE
              </Badge>
            </motion.div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[420px] px-4 pb-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
              <Shield className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">
                {isScanning ? 'Waiting for results...' : 'No alerts yet. Run a scan to detect regulatory updates.'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <AlertCard key={`${alert.title}-${index}`} alert={alert} index={index} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function AlertCard({ alert, index }: { alert: ClassifiedAlert; index: number }) {
  const config = severityConfig[alert.severity] || severityConfig.moderate;
  const SeverityIcon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div
        className={`rounded-lg border ${config.border} ${config.bg} p-3 transition-colors hover:bg-accent/50`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${config.color}`}>
            <SeverityIcon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-sm font-medium leading-tight">{alert.title}</h4>
              <Badge
                variant="outline"
                className={`text-[10px] shrink-0 uppercase tracking-wider ${config.color} ${config.border}`}
              >
                {alert.severity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{alert.description}</p>
            <div className="flex items-center flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-[10px]">
                {alert.source}
              </Badge>
              {alert.regulation && (
                <Badge variant="secondary" className="text-[10px]">
                  {alert.regulation}
                </Badge>
              )}
              {alert.affected_framework && (
                <Badge variant="outline" className="text-[10px]">
                  {alert.affected_framework}
                </Badge>
              )}
              {alert.url && (
                <a
                  href={alert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                  Source
                </a>
              )}
            </div>
            {alert.recommended_action && (
              <div className="mt-2 text-xs text-muted-foreground bg-background/50 rounded px-2 py-1">
                <span className="font-medium">Action:</span> {alert.recommended_action}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
