import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RiskLevel = "high" | "medium" | "low";

interface RiskLevelBadgeProps {
  level: RiskLevel | null;
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  high: {
    label: "High Risk",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  medium: {
    label: "Medium Risk",
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
  low: {
    label: "Low Risk",
    className: "bg-primary/20 text-primary border-primary/30",
  },
};

export function RiskLevelBadge({ level }: RiskLevelBadgeProps) {
  if (!level) return <span className="text-muted-foreground">—</span>;
  const config = riskConfig[level];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
