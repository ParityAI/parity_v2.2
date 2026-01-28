import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

interface ComplianceStatsProps {
  stats: {
    total: number;
    passed: number;
    inProgress: number;
    pending: number;
    overdue: number;
  };
}

export function ComplianceStats({ stats }: ComplianceStatsProps) {
  const statItems = [
    { label: "Total Frameworks", value: stats.total, icon: Shield, color: "text-foreground" },
    { label: "Passed", value: stats.passed, icon: CheckCircle, color: "text-primary" },
    { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-blue-500" },
    { label: "Pending Review", value: stats.pending, icon: AlertTriangle, color: "text-yellow-500" },
    { label: "Overdue", value: stats.overdue, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statItems.map((item) => (
        <Card key={item.label} className="border-border/50 bg-card/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-lg bg-secondary/50 p-2.5 ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
