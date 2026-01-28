import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [modelsRes, vendorsRes, incidentsRes, assessmentsRes] = await Promise.all([
        supabase.from("models").select("id, status, risk_level"),
        supabase.from("vendors").select("id"),
        supabase.from("incidents").select("id, status, severity"),
        supabase.from("compliance_assessments").select("id, status, deadline"),
      ]);

      if (modelsRes.error) throw modelsRes.error;
      if (vendorsRes.error) throw vendorsRes.error;
      if (incidentsRes.error) throw incidentsRes.error;
      if (assessmentsRes.error) throw assessmentsRes.error;

      const models = modelsRes.data || [];
      const vendors = vendorsRes.data || [];
      const incidents = incidentsRes.data || [];
      const assessments = assessmentsRes.data || [];

      // Calculate compliance score based on passed assessments
      const passedAssessments = assessments.filter(a => a.status === "passed").length;
      const totalAssessments = assessments.length;
      const complianceScore = totalAssessments > 0 
        ? Math.round((passedAssessments / totalAssessments) * 100) 
        : 0;

      // Open incidents (not closed)
      const openIncidents = incidents.filter(i => i.status !== "closed");
      const criticalIncidents = openIncidents.filter(i => i.severity === "critical").length;

      // Risk distribution
      const riskDistribution = [
        { name: "High", value: models.filter(m => m.risk_level === "high").length, color: "hsl(var(--destructive))" },
        { name: "Medium", value: models.filter(m => m.risk_level === "medium").length, color: "hsl(var(--warning))" },
        { name: "Low", value: models.filter(m => m.risk_level === "low").length, color: "hsl(var(--success))" },
      ];

      // Incident status breakdown
      const incidentData = [
        { status: "Open", count: incidents.filter(i => i.status === "open").length, color: "hsl(var(--destructive))" },
        { status: "Investigating", count: incidents.filter(i => i.status === "investigating").length, color: "hsl(var(--warning))" },
        { status: "Mitigated", count: incidents.filter(i => i.status === "mitigated").length, color: "hsl(var(--info))" },
        { status: "Closed", count: incidents.filter(i => i.status === "closed").length, color: "hsl(var(--success))" },
      ];

      // Task radar based on assessment deadlines
      const now = new Date();
      const overdue = assessments.filter(a => a.deadline && new Date(a.deadline) < now && a.status !== "passed").length;
      const dueSoon = assessments.filter(a => {
        if (!a.deadline || a.status === "passed") return false;
        const deadline = new Date(a.deadline);
        const daysUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntil >= 0 && daysUntil <= 7;
      }).length;
      const upcoming = assessments.filter(a => {
        if (!a.deadline || a.status === "passed") return false;
        const deadline = new Date(a.deadline);
        const daysUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntil > 7;
      }).length;

      const taskData = [
        { name: "Overdue", value: overdue, color: "hsl(var(--destructive))" },
        { name: "Due Soon", value: dueSoon, color: "hsl(var(--warning))" },
        { name: "Upcoming", value: upcoming, color: "hsl(var(--info))" },
      ];

      return {
        stats: {
          totalModels: models.length,
          totalVendors: vendors.length,
          openIncidents: openIncidents.length,
          criticalIncidents,
          complianceScore,
        },
        riskDistribution,
        incidentData,
        taskData,
      };
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });
}
