import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ModelStatus = "approved" | "restricted" | "pending" | "blocked";

interface ModelStatusBadgeProps {
  status: ModelStatus;
}

const statusConfig: Record<ModelStatus, { label: string; className: string }> = {
  approved: {
    label: "Approved",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
  restricted: {
    label: "Restricted",
    className: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  },
  blocked: {
    label: "Blocked",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
};

export function ModelStatusBadge({ status }: ModelStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
