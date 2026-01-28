import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Building2, AlertCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  stats: {
    totalModels: number;
    totalVendors: number;
    openIncidents: number;
    criticalIncidents: number;
    complianceScore: number;
  } | undefined;
  isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const statItems = [
    { 
      label: "AI Models", 
      value: stats?.totalModels || 0, 
      icon: Database, 
      change: stats?.totalModels ? `${stats.totalModels} registered` : "No models yet"
    },
    { 
      label: "Vendors", 
      value: stats?.totalVendors || 0, 
      icon: Building2, 
      change: stats?.totalVendors ? `${stats.totalVendors} active` : "No vendors yet"
    },
    { 
      label: "Open Incidents", 
      value: stats?.openIncidents || 0, 
      icon: AlertCircle, 
      change: stats?.criticalIncidents ? `${stats.criticalIncidents} critical` : "None critical"
    },
    { 
      label: "Compliance Score", 
      value: `${stats?.complianceScore || 0}%`, 
      icon: TrendingUp, 
      change: stats?.complianceScore ? "Based on assessments" : "No assessments yet"
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
