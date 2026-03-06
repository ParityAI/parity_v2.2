import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Building,
  PieChart,
  FileText
} from "lucide-react";

const stats = [
  {
    name: "Credit Models Audited",
    value: "24",
    change: "+3 this month",
    icon: CreditCard,
    trend: "up"
  },
  {
    name: "Lending Decisions Analyzed",
    value: "15.2K",
    change: "+2.1K this week",
    icon: Building,
    trend: "up"
  },
  {
    name: "Fairness Score",
    value: "94.2%",
    change: "+1.8% improvement",
    icon: PieChart,
    trend: "up"
  },
  {
    name: "Compliance Issues",
    value: "3",
    change: "-2 from last month",
    icon: AlertTriangle,
    trend: "down"
  },
];

const creditModels = [
  { name: "Consumer Credit Score v3.2", status: "compliant", fairnessScore: 96, lastAudit: "2 days ago" },
  { name: "Mortgage Approval Engine", status: "review", fairnessScore: 89, lastAudit: "1 week ago" },
  { name: "Auto Loan Risk Model", status: "compliant", fairnessScore: 94, lastAudit: "3 days ago" },
  { name: "Small Business Lending AI", status: "flagged", fairnessScore: 78, lastAudit: "5 days ago" },
];

const complianceFrameworks = [
  { name: "ECOA Compliance", progress: 92, status: "on-track" },
  { name: "Fair Housing Act", progress: 88, status: "on-track" },
  { name: "CFPB Guidelines", progress: 75, status: "needs-attention" },
  { name: "State Fair Lending Laws", progress: 95, status: "on-track" },
];

const recentAlerts = [
  { message: "Disparate impact detected in Small Business Lending AI", severity: "high", time: "2 hours ago" },
  { message: "Mortgage Approval Engine audit due in 3 days", severity: "medium", time: "5 hours ago" },
  { message: "New CFPB guidance requires model update", severity: "medium", time: "1 day ago" },
  { message: "Consumer Credit Score v3.2 passed bias review", severity: "low", time: "2 days ago" },
];

const FinParity = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            FinParity
          </h1>
          <p className="text-muted-foreground">Financial AI Governance - Lending & Credit Fairness</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <TrendingUp className="mr-1 h-3 w-3" />
          Active Monitoring
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-yellow-500'}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Credit Models Table */}
        <Card>
          <CardHeader>
            <CardTitle>Credit & Lending Models</CardTitle>
            <CardDescription>Active models under fairness monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {creditModels.map((model) => (
                <div key={model.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground">Last audit: {model.lastAudit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{model.fairnessScore}%</p>
                      <p className="text-xs text-muted-foreground">Fairness</p>
                    </div>
                    <Badge
                      variant={model.status === 'compliant' ? 'default' : model.status === 'review' ? 'secondary' : 'destructive'}
                    >
                      {model.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Frameworks */}
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Compliance</CardTitle>
            <CardDescription>Framework adherence status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceFrameworks.map((framework) => (
                <div key={framework.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{framework.name}</span>
                    <span className="text-sm text-muted-foreground">{framework.progress}%</span>
                  </div>
                  <Progress value={framework.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Recent Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                {alert.severity === 'high' ? (
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                ) : alert.severity === 'medium' ? (
                  <FileText className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinParity;
