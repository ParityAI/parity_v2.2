import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Shield,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { SourceStatus } from '../hooks/useRegulatoryRadar';

const sourceIcons: Record<string, React.ElementType> = {
  'eur-lex': FileText,
  'eu-ai-office': Shield,
  nist: Globe,
  'nyc-ll144': Building2,
};

const sourceColors: Record<string, { bg: string; border: string; glow: string }> = {
  'eur-lex': {
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
  },
  'eu-ai-office': {
    bg: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
  },
  nist: {
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
  },
  'nyc-ll144': {
    bg: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
  },
};

interface AgentStatusCardsProps {
  statuses: Record<string, SourceStatus>;
}

export function AgentStatusCards({ statuses }: AgentStatusCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.values(statuses).map((source, index) => (
        <AgentCard key={source.id} source={source} index={index} />
      ))}
    </div>
  );
}

function AgentCard({ source, index }: { source: SourceStatus; index: number }) {
  const Icon = sourceIcons[source.id] || Globe;
  const colors = sourceColors[source.id] || sourceColors['nist'];
  const isActive = source.status === 'running';
  const isDone = source.status === 'completed';
  const isError = source.status === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card
        className={`relative overflow-hidden border ${colors.border} ${
          isActive ? `shadow-lg ${colors.glow}` : ''
        } transition-all duration-500`}
      >
        {/* Animated scanning bar */}
        {isActive && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <CardContent className={`p-4 bg-gradient-to-br ${colors.bg}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  isActive
                    ? 'bg-primary/20'
                    : isDone
                    ? 'bg-green-500/20'
                    : isError
                    ? 'bg-red-500/20'
                    : 'bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{source.name}</h3>
              </div>
            </div>
            <StatusIndicator status={source.status} />
          </div>

          <p className="text-xs text-muted-foreground truncate mb-2">{source.message}</p>

          <div className="flex items-center justify-between">
            <StatusBadge status={source.status} />
            {source.alertCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <Badge variant="secondary" className="text-xs">
                  {source.alertCount} alert{source.alertCount !== 1 ? 's' : ''}
                </Badge>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusIndicator({ status }: { status: SourceStatus['status'] }) {
  if (status === 'running') {
    return (
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      </motion.div>
    );
  }
  if (status === 'error') {
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <AlertCircle className="h-4 w-4 text-red-500" />
      </motion.div>
    );
  }
  // idle
  return <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />;
}

function StatusBadge({ status }: { status: SourceStatus['status'] }) {
  if (status === 'running') {
    return (
      <Badge variant="outline" className="text-xs border-red-500/50 text-red-400 gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Scanning
      </Badge>
    );
  }
  if (status === 'completed') {
    return (
      <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
        Complete
      </Badge>
    );
  }
  if (status === 'error') {
    return (
      <Badge variant="outline" className="text-xs border-red-500/50 text-red-400">
        Failed
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-xs text-muted-foreground">
      Idle
    </Badge>
  );
}
