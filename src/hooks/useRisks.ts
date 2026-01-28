import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export function useRisks() {
  return useQuery({
    queryKey: ["risks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("risks")
        .select("*, profiles:owner_id(full_name), models(name), vendors(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Risk[];
    },
  });
}

export function useCreateRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (risk: RiskInsert) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .single();

      const { data, error } = await supabase
        .from("risks")
        .insert({
          ...risk,
          organization_id: profile?.organization_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
    mutationFn: async ({ id, ...updates }: RiskUpdate) => {
      const { data, error } = await supabase
        .from("risks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("risks").delete().eq("id", id);
      if (error) throw error;
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
