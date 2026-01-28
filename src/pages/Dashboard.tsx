import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats, useRecentActivity } from "@/hooks/useDashboardStats";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  const { data: dashboardData, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">FairHire AI - HR Governance Overview</p>
        </div>
        <div className="flex gap-2">
          <Link to="/models">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Model
            </Button>
          </Link>
          <Link to="/vendors">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={dashboardData?.stats} isLoading={statsLoading} />

      {/* Charts Row */}
      <DashboardCharts
        taskData={dashboardData?.taskData}
        incidentData={dashboardData?.incidentData}
        riskDistribution={dashboardData?.riskDistribution}
        isLoading={statsLoading}
      />

      {/* Recent Activity */}
      <RecentActivity activities={activities} isLoading={activitiesLoading} />
    </div>
  );
};

export default Dashboard;
