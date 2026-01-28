import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Building2,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// Demo data
const stats = [
  { label: "AI Models", value: "12", icon: Database, change: "+2 this month" },
  { label: "Vendors", value: "8", icon: Building2, change: "3 pending review" },
  { label: "Open Incidents", value: "3", icon: AlertCircle, change: "1 critical" },
  { label: "Compliance Score", value: "87%", icon: TrendingUp, change: "+5% from last audit" },
];

const taskData = [
  { name: "Overdue", value: 2, color: "hsl(var(--destructive))" },
  { name: "Due Soon", value: 5, color: "hsl(var(--warning))" },
  { name: "Upcoming", value: 12, color: "hsl(var(--info))" },
];

const incidentData = [
  { status: "Open", count: 3, color: "hsl(var(--destructive))" },
  { status: "Investigating", count: 2, color: "hsl(var(--warning))" },
  { status: "Mitigated", count: 5, color: "hsl(var(--info))" },
  { status: "Closed", count: 15, color: "hsl(var(--success))" },
];

const riskDistribution = [
  { name: "High", value: 3, color: "hsl(var(--destructive))" },
  { name: "Medium", value: 7, color: "hsl(var(--warning))" },
  { name: "Low", value: 2, color: "hsl(var(--success))" },
];

const recentActivity = [
  { id: 1, type: "model", action: "Model HireScore v2.3 approved", time: "2 hours ago", icon: CheckCircle2 },
  { id: 2, type: "incident", action: "Incident INC-2024-003 escalated to critical", time: "4 hours ago", icon: AlertCircle },
  { id: 3, type: "compliance", action: "NYC LL144 audit completed", time: "1 day ago", icon: CheckCircle2 },
  { id: 4, type: "vendor", action: "New vendor TalentAI added for review", time: "2 days ago", icon: Clock },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">FairHire AI - HR Governance Overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Model
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Task Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Radar</CardTitle>
            <CardDescription>Compliance task status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {taskData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incident Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incident Status</CardTitle>
            <CardDescription>Current incident breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="status" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {incidentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
            <CardDescription>Models by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <activity.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
