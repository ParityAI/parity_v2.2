import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ComplianceStatus = "passed" | "in_progress" | "pending" | "failed" | "not_started";

interface ComplianceStatusBadgeProps {
  status: string;
}

const statusConfig: Record<ComplianceStatus, { label: string; className: string }> = {
  passed: {
    label: "Passed",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  },
  pending: {
    label: "Pending Review",
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  not_started: {
    label: "Not Started",
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export function ComplianceStatusBadge({ status }: ComplianceStatusBadgeProps) {
  const config = statusConfig[status as ComplianceStatus] || statusConfig.not_started;
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
