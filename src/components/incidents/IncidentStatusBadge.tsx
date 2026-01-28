import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type IncidentStatus = "open" | "investigating" | "mitigated" | "closed";

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
}

const statusConfig: Record<IncidentStatus, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  investigating: {
    label: "Investigating",
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
  mitigated: {
    label: "Mitigated",
    className: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  },
  closed: {
    label: "Closed",
    className: "bg-primary/20 text-primary border-primary/30",
  },
};

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
