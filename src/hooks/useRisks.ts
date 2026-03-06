import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type RiskSeverity = "negligible" | "minor" | "moderate" | "major" | "critical";
export type RiskLikelihood = "very_low" | "low" | "medium" | "high" | "very_high";
export type MitigationStatus = "not_started" | "in_progress" | "completed" | "accepted";

export interface Risk {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  category: string | null;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  impact: string | null;
  mitigation_status: MitigationStatus;
  mitigation_plan: string | null;
  owner_id: string | null;
  model_id: string | null;
  vendor_id: string | null;
  identified_date: string | null;
  review_date: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null } | null;
  models?: { name: string } | null;
  vendors?: { name: string } | null;
}

export interface RiskInsert {
  title: string;
  description?: string | null;
  category?: string | null;
  severity?: RiskSeverity;
  likelihood?: RiskLikelihood;
  impact?: string | null;
  mitigation_status?: MitigationStatus;
  mitigation_plan?: string | null;
  owner_id?: string | null;
  model_id?: string | null;
  vendor_id?: string | null;
  identified_date?: string | null;
  review_date?: string | null;
}

export interface RiskUpdate extends Partial<RiskInsert> {
  id: string;
}

const DEMO_RISKS: Risk[] = [
  {
    id: "demo-1", organization_id: "demo-org", title: "Model Bias in Hiring Algorithm",
    description: "Potential demographic bias detected", category: "Fairness",
    severity: "critical", likelihood: "medium", impact: "Regulatory fines",
    mitigation_status: "in_progress", mitigation_plan: "Conduct bias audit",
    owner_id: null, model_id: null, vendor_id: null,
    identified_date: new Date(Date.now() - 604800000).toISOString(),
    review_date: new Date(Date.now() + 604800000).toISOString(),
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Sarah Johnson" },
  },
  {
    id: "demo-2", organization_id: "demo-org", title: "Data Privacy Compliance Gap",
    description: "Training data may contain PII", category: "Privacy",
    severity: "major", likelihood: "high", impact: "GDPR violation penalties",
    mitigation_status: "not_started", mitigation_plan: "Audit training datasets",
    owner_id: null, model_id: null, vendor_id: null,
    identified_date: new Date(Date.now() - 259200000).toISOString(),
    review_date: new Date(Date.now() + 1209600000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Michael Chen" },
  },
];

export function useRisks() {
  return useQuery({
    queryKey: ["risks"],
    queryFn: async () => DEMO_RISKS,
  });
}

export function useCreateRisk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_risk: RiskInsert) => {
      throw new Error("Database table 'risks' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      toast.success("Risk created successfully");
    },
    onError: (error) => toast.error("Failed to create risk: " + error.message),
  });
}

export function useUpdateRisk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_update: RiskUpdate) => {
      throw new Error("Database table 'risks' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      toast.success("Risk updated successfully");
    },
    onError: (error) => toast.error("Failed to update risk: " + error.message),
  });
}

export function useDeleteRisk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error("Database table 'risks' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      toast.success("Risk deleted successfully");
    },
    onError: (error) => toast.error("Failed to delete risk: " + error.message),
  });
}
