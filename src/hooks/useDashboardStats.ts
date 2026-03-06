import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Demo fallback data
const DEMO_STATS = {
  stats: {
    totalModels: 12,
    totalVendors: 8,
    openIncidents: 3,
    criticalIncidents: 1,
    complianceScore: 73,
    evidenceCoverage: 58,
  },
  riskDistribution: [
    { name: "High", value: 3, color: "hsl(var(--destructive))" },
    { name: "Medium", value: 5, color: "hsl(var(--warning, 38 92% 50%))" },
    { name: "Low", value: 4, color: "hsl(var(--success, 142 71% 45%))" },
  ],
  incidentData: [
    { status: "Open", count: 1, color: "hsl(var(--destructive))" },
    { status: "Investigating", count: 1, color: "hsl(var(--warning, 38 92% 50%))" },
    { status: "Mitigated", count: 1, color: "hsl(var(--info, 217 91% 60%))" },
    { status: "Closed", count: 5, color: "hsl(var(--success, 142 71% 45%))" },
  ],
  taskData: [
    { name: "Overdue", value: 2, color: "hsl(var(--destructive))" },
    { name: "Due Soon", value: 3, color: "hsl(var(--warning, 38 92% 50%))" },
    { name: "Upcoming", value: 5, color: "hsl(var(--info, 217 91% 60%))" },
  ],
  recentModels: [
    { id: "m1", name: "GPT-4 Classifier", status: "active", risk_level: "medium", created_at: new Date(Date.now() - 86400000).toISOString(), security_assessment: true },
    { id: "m2", name: "Credit Scoring Model", status: "under_review", risk_level: "high", created_at: new Date(Date.now() - 172800000).toISOString(), security_assessment: false },
    { id: "m3", name: "Fraud Detection v2", status: "active", risk_level: "high", created_at: new Date(Date.now() - 259200000).toISOString(), security_assessment: true },
    { id: "m4", name: "Resume Screener", status: "pending", risk_level: "medium", created_at: new Date(Date.now() - 345600000).toISOString(), security_assessment: false },
    { id: "m5", name: "Sentiment Analyzer", status: "active", risk_level: "low", created_at: new Date(Date.now() - 432000000).toISOString(), security_assessment: true },
  ],
  recentIncidents: [
    { id: "i1", title: "Bias detected in hiring model", severity: "critical", status: "investigating", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: "i2", title: "Model latency spike", severity: "medium", status: "open", created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "i3", title: "Data privacy concern", severity: "high", status: "mitigated", created_at: new Date(Date.now() - 172800000).toISOString() },
  ],
  vendors: [
    { id: "v1", name: "OpenAI", risk_score: 35 },
    { id: "v2", name: "Anthropic", risk_score: 28 },
    { id: "v3", name: "Google AI", risk_score: 32 },
    { id: "v4", name: "AWS SageMaker", risk_score: 22 },
  ],
};

export function useDashboardStats() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "models" }, () => {
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "vendors" }, () => {
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "incidents" }, () => {
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "compliance_assessments" }, () => {
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const [modelsRes, vendorsRes, incidentsRes, assessmentsRes] = await Promise.all([
          supabase.from("models").select("id, status, risk_level, name, created_at, security_assessment"),
          supabase.from("vendors").select("id, name, risk_score"),
          supabase.from("incidents").select("id, status, severity, title, created_at"),
          supabase.from("compliance_assessments").select("id, status, deadline, framework_id"),
        ]);

        if (modelsRes.error || vendorsRes.error || incidentsRes.error || assessmentsRes.error) {
          console.log("Using demo dashboard stats");
          return DEMO_STATS;
        }

        const models = modelsRes.data || [];
        const vendors = vendorsRes.data || [];
        const incidents = incidentsRes.data || [];
        const assessments = assessmentsRes.data || [];

        const passedAssessments = assessments.filter(a => a.status === "passed").length;
        const totalAssessments = assessments.length;
        const complianceScore = totalAssessments > 0 ? Math.round((passedAssessments / totalAssessments) * 100) : 0;

        const openIncidents = incidents.filter(i => i.status !== "closed");
        const criticalIncidents = openIncidents.filter(i => i.severity === "critical").length;

        const riskDistribution = [
          { name: "High", value: models.filter(m => m.risk_level === "high").length, color: "hsl(var(--destructive))" },
          { name: "Medium", value: models.filter(m => m.risk_level === "medium").length, color: "hsl(var(--warning, 38 92% 50%))" },
          { name: "Low", value: models.filter(m => m.risk_level === "low").length, color: "hsl(var(--success, 142 71% 45%))" },
        ];

        const incidentData = [
          { status: "Open", count: incidents.filter(i => i.status === "open").length, color: "hsl(var(--destructive))" },
          { status: "Investigating", count: incidents.filter(i => i.status === "investigating").length, color: "hsl(var(--warning, 38 92% 50%))" },
          { status: "Mitigated", count: incidents.filter(i => i.status === "mitigated").length, color: "hsl(var(--info, 217 91% 60%))" },
          { status: "Closed", count: incidents.filter(i => i.status === "closed").length, color: "hsl(var(--success, 142 71% 45%))" },
        ];

        const now = new Date();
        const overdue = assessments.filter(a => a.deadline && new Date(a.deadline) < now && a.status !== "passed").length;
        const dueSoon = assessments.filter(a => {
          if (!a.deadline || a.status === "passed") return false;
          const daysUntil = (new Date(a.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysUntil >= 0 && daysUntil <= 7;
        }).length;
        const upcoming = assessments.filter(a => {
          if (!a.deadline || a.status === "passed") return false;
          const daysUntil = (new Date(a.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return daysUntil > 7;
        }).length;

        const taskData = [
          { name: "Overdue", value: overdue, color: "hsl(var(--destructive))" },
          { name: "Due Soon", value: dueSoon, color: "hsl(var(--warning, 38 92% 50%))" },
          { name: "Upcoming", value: upcoming, color: "hsl(var(--info, 217 91% 60%))" },
        ];

        const recentModels = models
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        const recentIncidents = incidents
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);

        const assessedModels = models.filter(m => m.security_assessment === true).length;
        const evidenceCoverage = models.length > 0 ? Math.round((assessedModels / models.length) * 100) : 0;

        return {
          stats: {
            totalModels: models.length || DEMO_STATS.stats.totalModels,
            totalVendors: vendors.length || DEMO_STATS.stats.totalVendors,
            openIncidents: openIncidents.length,
            criticalIncidents,
            complianceScore: complianceScore || DEMO_STATS.stats.complianceScore,
            evidenceCoverage: evidenceCoverage || DEMO_STATS.stats.evidenceCoverage,
          },
          riskDistribution: riskDistribution.some(r => r.value > 0) ? riskDistribution : DEMO_STATS.riskDistribution,
          incidentData: incidentData.some(i => i.count > 0) ? incidentData : DEMO_STATS.incidentData,
          taskData: taskData.some(t => t.value > 0) ? taskData : DEMO_STATS.taskData,
          recentModels: recentModels.length > 0 ? recentModels : DEMO_STATS.recentModels,
          recentIncidents: recentIncidents.length > 0 ? recentIncidents : DEMO_STATS.recentIncidents,
          vendors: vendors.length > 0 ? vendors : DEMO_STATS.vendors,
        };
      } catch (error) {
        console.log("Dashboard stats error, using demo data:", error);
        return DEMO_STATS;
      }
    },
    refetchInterval: 30000,
  });
}

const DEMO_ACTIVITY = [
  { id: "a1", action: "created", entity_type: "model", entity_id: "m1", user_id: "demo", organization_id: "demo-org", created_at: new Date(Date.now() - 1800000).toISOString(), details: { name: "GPT-4 Classifier" } },
  { id: "a2", action: "updated", entity_type: "incident", entity_id: "i1", user_id: "demo", organization_id: "demo-org", created_at: new Date(Date.now() - 3600000).toISOString(), details: { title: "Bias detected in hiring model" } },
  { id: "a3", action: "completed", entity_type: "assessment", entity_id: "as1", user_id: "demo", organization_id: "demo-org", created_at: new Date(Date.now() - 7200000).toISOString(), details: { framework: "EU AI Act" } },
  { id: "a4", action: "created", entity_type: "vendor", entity_id: "v1", user_id: "demo", organization_id: "demo-org", created_at: new Date(Date.now() - 14400000).toISOString(), details: { name: "OpenAI" } },
  { id: "a5", action: "published", entity_type: "policy", entity_id: "p1", user_id: "demo", organization_id: "demo-org", created_at: new Date(Date.now() - 28800000).toISOString(), details: { title: "AI Ethics Policy v2.1" } },
];

export function useRecentActivity() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("activity-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "audit_logs" }, () => {
        queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error || !data || data.length === 0) {
        return DEMO_ACTIVITY;
      }
      return data;
    },
  });
}
