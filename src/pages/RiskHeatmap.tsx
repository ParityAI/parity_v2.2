import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Filter,
  Info,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// Risk categories
const riskCategories = [
  { id: "bias", name: "Bias & Fairness", weight: 0.25 },
  { id: "transparency", name: "Transparency", weight: 0.20 },
  { id: "security", name: "Security & Privacy", weight: 0.20 },
  { id: "accountability", name: "Accountability", weight: 0.15 },
  { id: "reliability", name: "Reliability", weight: 0.10 },
  { id: "compliance", name: "Regulatory", weight: 0.10 },
];

// Department risk data
const departmentRisks = [
  {
    id: "social-services",
    name: "Social Services",
    abbreviation: "DSS",
    aiSystems: 4,
    risks: {
      bias: { score: 72, trend: "improving", incidents: 1 },
      transparency: { score: 85, trend: "stable", incidents: 0 },
      security: { score: 91, trend: "stable", incidents: 0 },
      accountability: { score: 88, trend: "improving", incidents: 0 },
      reliability: { score: 79, trend: "declining", incidents: 2 },
      compliance: { score: 94, trend: "stable", incidents: 0 },
    },
    overallScore: 82,
    highRiskSystems: 2,
  },
  {
    id: "hr",
    name: "Human Resources",
    abbreviation: "HR",
    aiSystems: 3,
    risks: {
      bias: { score: 68, trend: "improving", incidents: 2 },
      transparency: { score: 82, trend: "stable", incidents: 0 },
      security: { score: 95, trend: "stable", incidents: 0 },
      accountability: { score: 90, trend: "stable", incidents: 0 },
      reliability: { score: 88, trend: "stable", incidents: 0 },
      compliance: { score: 91, trend: "improving", incidents: 0 },
    },
    overallScore: 81,
    highRiskSystems: 1,
  },
  {
    id: "transportation",
    name: "Transportation",
    abbreviation: "DOT",
    aiSystems: 5,
    risks: {
      bias: { score: 95, trend: "stable", incidents: 0 },
      transparency: { score: 88, trend: "stable", incidents: 0 },
      security: { score: 87, trend: "declining", incidents: 1 },
      accountability: { score: 92, trend: "stable", incidents: 0 },
      reliability: { score: 94, trend: "improving", incidents: 0 },
      compliance: { score: 96, trend: "stable", incidents: 0 },
    },
    overallScore: 92,
    highRiskSystems: 0,
  },
  {
    id: "revenue",
    name: "Revenue & Taxation",
    abbreviation: "REV",
    aiSystems: 2,
    risks: {
      bias: { score: 89, trend: "stable", incidents: 0 },
      transparency: { score: 76, trend: "improving", incidents: 0 },
      security: { score: 98, trend: "stable", incidents: 0 },
      accountability: { score: 94, trend: "stable", incidents: 0 },
      reliability: { score: 96, trend: "stable", incidents: 0 },
      compliance: { score: 93, trend: "stable", incidents: 0 },
    },
    overallScore: 91,
    highRiskSystems: 0,
  },
  {
    id: "citizen-services",
    name: "Citizen Services",
    abbreviation: "CS",
    aiSystems: 2,
    risks: {
      bias: { score: 98, trend: "stable", incidents: 0 },
      transparency: { score: 96, trend: "stable", incidents: 0 },
      security: { score: 92, trend: "stable", incidents: 0 },
      accountability: { score: 95, trend: "stable", incidents: 0 },
      reliability: { score: 89, trend: "stable", incidents: 1 },
      compliance: { score: 99, trend: "stable", incidents: 0 },
    },
    overallScore: 95,
    highRiskSystems: 0,
  },
  {
    id: "public-works",
    name: "Public Works",
    abbreviation: "PW",
    aiSystems: 3,
    risks: {
      bias: { score: 97, trend: "stable", incidents: 0 },
      transparency: { score: 90, trend: "stable", incidents: 0 },
      security: { score: 85, trend: "stable", incidents: 0 },
      accountability: { score: 91, trend: "stable", incidents: 0 },
      reliability: { score: 93, trend: "improving", incidents: 0 },
      compliance: { score: 94, trend: "stable", incidents: 0 },
    },
    overallScore: 92,
    highRiskSystems: 0,
  },
  {
    id: "health",
    name: "Public Health",
    abbreviation: "PH",
    aiSystems: 4,
    risks: {
      bias: { score: 75, trend: "improving", incidents: 1 },
      transparency: { score: 80, trend: "stable", incidents: 0 },
      security: { score: 96, trend: "stable", incidents: 0 },
      accountability: { score: 85, trend: "improving", incidents: 0 },
      reliability: { score: 91, trend: "stable", incidents: 0 },
      compliance: { score: 88, trend: "improving", incidents: 1 },
    },
    overallScore: 85,
    highRiskSystems: 2,
  },
  {
    id: "education",
    name: "Education",
    abbreviation: "EDU",
    aiSystems: 2,
    risks: {
      bias: { score: 82, trend: "stable", incidents: 0 },
      transparency: { score: 91, trend: "stable", incidents: 0 },
      security: { score: 94, trend: "stable", incidents: 0 },
      accountability: { score: 89, trend: "stable", incidents: 0 },
      reliability: { score: 87, trend: "stable", incidents: 0 },
      compliance: { score: 92, trend: "stable", incidents: 0 },
    },
    overallScore: 89,
    highRiskSystems: 0,
  },
];

function getRiskColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-emerald-400";
  if (score >= 70) return "bg-amber-400";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function getRiskBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500/20";
  if (score >= 80) return "bg-emerald-400/20";
  if (score >= 70) return "bg-amber-400/20";
  if (score >= 60) return "bg-amber-500/20";
  return "bg-red-500/20";
}

function TrendIcon({ trend }: { trend: string }) {
  switch (trend) {
    case "improving":
      return <TrendingUp className="h-3 w-3 text-emerald-500" />;
    case "declining":
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    default:
      return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
}

function HeatmapCell({
  score,
  trend,
  incidents,
  department,
  category,
}: {
  score: number;
  trend: string;
  incidents: number;
  department: string;
  category: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`relative flex h-16 w-full cursor-pointer items-center justify-center rounded-lg ${getRiskBgColor(score)} transition-all hover:ring-2 hover:ring-primary/50`}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg font-semibold text-foreground">{score}</span>
            {incidents > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {incidents}
              </span>
            )}
            <span className="absolute bottom-1 right-1">
              <TrendIcon trend={trend} />
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{department}</p>
            <p className="text-muted-foreground">{category}: {score}%</p>
            {incidents > 0 && (
              <p className="text-red-400">{incidents} incident{incidents > 1 ? "s" : ""}</p>
            )}
            <p className="capitalize text-muted-foreground">Trend: {trend}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function RiskHeatmap() {
  const [timeRange, setTimeRange] = useState("30d");

  // Calculate totals
  const totalSystems = departmentRisks.reduce((acc, d) => acc + d.aiSystems, 0);
  const totalHighRisk = departmentRisks.reduce((acc, d) => acc + d.highRiskSystems, 0);
  const avgScore = Math.round(
    departmentRisks.reduce((acc, d) => acc + d.overallScore, 0) / departmentRisks.length
  );
  const totalIncidents = departmentRisks.reduce(
    (acc, d) => acc + Object.values(d.risks).reduce((a, r) => a + r.incidents, 0),
    0
  );

  // Sort departments by overall score for ranking
  const sortedDepts = [...departmentRisks].sort((a, b) => a.overallScore - b.overallScore);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">
              <div>
                <h1 className="text-xl font-semibold text-foreground">AI Risk Heatmap</h1>
                <p className="text-sm text-muted-foreground">
                  Visual dashboard showing AI risk across government departments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Summary Stats */}
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{departmentRisks.length}</p>
                    <p className="text-sm text-muted-foreground">Departments</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{totalSystems}</p>
                    <p className="text-sm text-muted-foreground">AI Systems</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getRiskBgColor(avgScore)}`}>
                    <span className="text-lg font-bold text-foreground">{avgScore}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                    <p className="text-xs text-emerald-500">+2.3% from last month</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-red-500">{totalIncidents}</p>
                    <p className="text-sm text-muted-foreground">Active Incidents</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 flex items-center gap-6 rounded-lg border border-border/50 bg-card/50 p-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Risk Score Legend:</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">90-100 (Low)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-emerald-400" />
                  <span className="text-xs text-muted-foreground">80-89</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-amber-400" />
                  <span className="text-xs text-muted-foreground">70-79</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-amber-500" />
                  <span className="text-xs text-muted-foreground">60-69</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-red-500" />
                  <span className="text-xs text-muted-foreground">&lt;60 (High)</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Improving</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-muted-foreground">Declining</span>
                </div>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="mb-8 overflow-x-auto rounded-xl border border-border/50 bg-card/50">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="sticky left-0 z-10 bg-card/95 px-4 py-3 text-left text-sm font-medium text-muted-foreground backdrop-blur">
                      Department
                    </th>
                    {riskCategories.map((cat) => (
                      <th key={cat.id} className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                        <div>{cat.name}</div>
                        <div className="text-xs font-normal">({(cat.weight * 100).toFixed(0)}%)</div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      Overall
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {departmentRisks.map((dept) => (
                    <tr key={dept.id} className="border-b border-border/30">
                      <td className="sticky left-0 z-10 bg-card/95 px-4 py-3 backdrop-blur">
                        <Link
                          to={`/department/${dept.id}`}
                          className="group flex items-center gap-2"
                        >
                          <Badge variant="outline" className="font-mono">
                            {dept.abbreviation}
                          </Badge>
                          <span className="font-medium text-foreground group-hover:text-primary">
                            {dept.name}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {dept.aiSystems} AI systems • {dept.highRiskSystems} high-risk
                        </p>
                      </td>
                      {riskCategories.map((cat) => (
                        <td key={cat.id} className="px-2 py-2">
                          <HeatmapCell
                            score={dept.risks[cat.id as keyof typeof dept.risks].score}
                            trend={dept.risks[cat.id as keyof typeof dept.risks].trend}
                            incidents={dept.risks[cat.id as keyof typeof dept.risks].incidents}
                            department={dept.name}
                            category={cat.name}
                          />
                        </td>
                      ))}
                      <td className="px-2 py-2">
                        <div
                          className={`flex h-16 items-center justify-center rounded-lg ${getRiskBgColor(dept.overallScore)} font-bold`}
                        >
                          <span className="text-xl text-foreground">{dept.overallScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Departments Needing Attention */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-medium text-foreground">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Departments Needing Attention
                </h3>
                <div className="space-y-3">
                  {sortedDepts.slice(0, 3).map((dept) => (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between rounded-lg bg-background/50 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{dept.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {dept.highRiskSystems} high-risk systems
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-foreground">{dept.overallScore}</p>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-medium text-foreground">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  Top Performing Departments
                </h3>
                <div className="space-y-3">
                  {sortedDepts.slice(-3).reverse().map((dept) => (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between rounded-lg bg-background/50 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{dept.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {dept.aiSystems} AI systems
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-emerald-500">{dept.overallScore}</p>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
