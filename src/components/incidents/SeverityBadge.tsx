import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Severity = "critical" | "high" | "medium" | "low";

interface SeverityBadgeProps {
  severity: Severity;
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className: "bg-red-600/20 text-red-500 border-red-500/30",
  },
  high: {
    label: "High",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  medium: {
    label: "Medium",
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
  low: {
    label: "Low",
    className: "bg-primary/20 text-primary border-primary/30",
  },
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
