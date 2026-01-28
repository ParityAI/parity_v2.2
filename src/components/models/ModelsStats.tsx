import { Card, CardContent } from "@/components/ui/card";
import { Cpu, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { Model } from "@/hooks/useModels";

interface ModelsStatsProps {
  models: Model[] | undefined;
}

export function ModelsStats({ models }: ModelsStatsProps) {
  const stats = {
    total: models?.length || 0,
    approved: models?.filter((m) => m.status === "approved").length || 0,
    pending: models?.filter((m) => m.status === "pending").length || 0,
    restricted: models?.filter((m) => m.status === "restricted").length || 0,
    blocked: models?.filter((m) => m.status === "blocked").length || 0,
  };

  const statItems = [
    { label: "Total Models", value: stats.total, icon: Cpu, color: "text-foreground" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { label: "Restricted", value: stats.restricted, icon: AlertTriangle, color: "text-orange-500" },
    { label: "Blocked", value: stats.blocked, icon: XCircle, color: "text-destructive" },
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
