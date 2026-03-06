import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Brain,
  FileText,
  Users
} from "lucide-react";

const stats = [
  {
    name: "Clinical AI Models",
    value: "18",
    change: "+2 this month",
    icon: Brain,
    trend: "up"
  },
  {
    name: "Patient Decisions Analyzed",
    value: "42.5K",
    change: "+8.3K this week",
    icon: Users,
    trend: "up"
  },
  {
    name: "Equity Score",
    value: "91.7%",
    change: "+2.3% improvement",
    icon: Activity,
    trend: "up"
  },
  {
    name: "Safety Alerts",
    value: "5",
    change: "-3 from last month",
    icon: AlertTriangle,
    trend: "down"
  },
];

const clinicalModels = [
  { name: "Diagnostic Imaging AI v2.1", status: "compliant", equityScore: 94, lastAudit: "1 day ago", department: "Radiology" },
  { name: "Treatment Recommendation Engine", status: "review", equityScore: 87, lastAudit: "1 week ago", department: "Oncology" },
  { name: "Patient Risk Stratification", status: "compliant", equityScore: 92, lastAudit: "4 days ago", department: "ICU" },
  { name: "Drug Interaction Checker", status: "compliant", equityScore: 98, lastAudit: "2 days ago", department: "Pharmacy" },
  { name: "Sepsis Early Warning System", status: "flagged", equityScore: 79, lastAudit: "6 days ago", department: "Emergency" },
];

const complianceFrameworks = [
  { name: "FDA AI/ML Guidelines", progress: 88, status: "on-track" },
  { name: "HIPAA Compliance", progress: 95, status: "on-track" },
  { name: "Clinical Decision Support Standards", progress: 82, status: "needs-attention" },
  { name: "Healthcare Equity Requirements", progress: 90, status: "on-track" },
];

const disparityMetrics = [
  { group: "Age Groups", disparity: 3.2, status: "acceptable" },
  { group: "Gender", disparity: 1.8, status: "acceptable" },
  { group: "Ethnicity", disparity: 5.1, status: "review" },
  { group: "Socioeconomic", disparity: 4.7, status: "review" },
];

const recentAlerts = [
  { message: "Demographic disparity detected in Sepsis Early Warning System", severity: "high", time: "3 hours ago" },
  { message: "Treatment Recommendation Engine requires fairness recalibration", severity: "medium", time: "8 hours ago" },
  { message: "New FDA guidance on AI transparency published", severity: "medium", time: "1 day ago" },
  { message: "Diagnostic Imaging AI passed annual equity audit", severity: "low", time: "1 day ago" },
];

const MedParity = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            MedParity
          </h1>
          <p className="text-muted-foreground">Healthcare AI Governance - Clinical Equity & Patient Safety</p>
        </div>
        <Badge variant="outline" className="text-green-500 border-green-500">
          <Activity className="mr-1 h-3 w-3" />
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
        {/* Clinical Models Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Clinical AI Models
            </CardTitle>
            <CardDescription>Active diagnostic and treatment AI systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clinicalModels.map((model) => (
                <div key={model.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{model.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{model.department}</span>
                      <span>•</span>
                      <span>Last audit: {model.lastAudit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{model.equityScore}%</p>
                      <p className="text-xs text-muted-foreground">Equity</p>
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
            <CardDescription>Healthcare AI regulation adherence</CardDescription>
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

        {/* Disparity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Outcome Disparities</CardTitle>
            <CardDescription>Cross-demographic performance gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disparityMetrics.map((metric) => (
                <div key={metric.group} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">{metric.group}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{metric.disparity}% gap</span>
                    <Badge variant={metric.status === 'acceptable' ? 'default' : 'secondary'}>
                      {metric.status}
                    </Badge>
                  </div>
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
            Safety Alerts & Notifications
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

export default MedParity;
