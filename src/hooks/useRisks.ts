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

// Stub hooks - risks table needs to be created
export function useRisks() {
  return useQuery({
    queryKey: ["risks"],
    queryFn: async () => {
      // Table doesn't exist yet - return empty array
      return [] as Risk[];
    },
  });
}

export function useCreateRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_risk: RiskInsert) => {
      throw new Error("risks table not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Risk created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create risk: " + error.message);
    },
  });
}

export function useUpdateRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_update: RiskUpdate) => {
      throw new Error("risks table not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Risk updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update risk: " + error.message);
    },
  });
}

export function useDeleteRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error("risks table not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Risk deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete risk: " + error.message);
    },
  });
}
