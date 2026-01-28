import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Search, ShieldCheck, XCircle, AlertOctagon } from "lucide-react";
import { Incident } from "@/hooks/useIncidents";

interface IncidentsStatsProps {
  incidents: Incident[] | undefined;
}

export function IncidentsStats({ incidents }: IncidentsStatsProps) {
  const stats = {
    total: incidents?.length || 0,
    open: incidents?.filter((i) => i.status === "open").length || 0,
    investigating: incidents?.filter((i) => i.status === "investigating").length || 0,
    mitigated: incidents?.filter((i) => i.status === "mitigated").length || 0,
    closed: incidents?.filter((i) => i.status === "closed").length || 0,
    critical: incidents?.filter((i) => i.severity === "critical").length || 0,
  };

  const statItems = [
    { label: "Total Incidents", value: stats.total, icon: AlertTriangle, color: "text-foreground" },
    { label: "Open", value: stats.open, icon: XCircle, color: "text-destructive" },
    { label: "Investigating", value: stats.investigating, icon: Search, color: "text-yellow-500" },
    { label: "Mitigated", value: stats.mitigated, icon: ShieldCheck, color: "text-blue-500" },
    { label: "Closed", value: stats.closed, icon: ShieldCheck, color: "text-primary" },
    { label: "Critical", value: stats.critical, icon: AlertOctagon, color: "text-red-500" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
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
