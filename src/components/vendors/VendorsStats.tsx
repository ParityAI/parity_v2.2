import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle, Shield, ShieldOff, AlertTriangle } from "lucide-react";
import { Vendor } from "@/hooks/useVendors";

interface VendorsStatsProps {
  vendors: Vendor[] | undefined;
}

export function VendorsStats({ vendors }: VendorsStatsProps) {
  const stats = {
    total: vendors?.length || 0,
    assessed: vendors?.filter((v) => v.security_assessment).length || 0,
    pending: vendors?.filter((v) => !v.security_assessment).length || 0,
    highRisk: vendors?.filter((v) => v.risk_score && v.risk_score >= 70).length || 0,
    lowRisk: vendors?.filter((v) => v.risk_score && v.risk_score < 30).length || 0,
  };

  const statItems = [
    { label: "Total Vendors", value: stats.total, icon: Building2, color: "text-foreground" },
    { label: "Security Assessed", value: stats.assessed, icon: Shield, color: "text-primary" },
    { label: "Pending Assessment", value: stats.pending, icon: ShieldOff, color: "text-yellow-500" },
    { label: "High Risk", value: stats.highRisk, icon: AlertTriangle, color: "text-destructive" },
    { label: "Low Risk", value: stats.lowRisk, icon: CheckCircle, color: "text-green-500" },
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
