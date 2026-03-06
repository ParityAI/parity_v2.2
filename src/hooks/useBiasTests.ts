import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type BiasTestResult = "pass" | "fail" | "warning";

export interface BiasTest {
  id: string;
  organization_id: string;
  model_id: string;
  test_type: string;
  protected_attribute: string;
  result: BiasTestResult;
  score: number | null;
  threshold: number | null;
  details: Record<string, unknown> | null;
  tested_by: string | null;
  test_date: string | null;
  created_at: string;
  models?: { name: string } | null;
  profiles?: { full_name: string | null } | null;
}

export interface BiasTestInsert {
  model_id: string;
  test_type: string;
  protected_attribute: string;
  result: BiasTestResult;
  score?: number | null;
  threshold?: number | null;
  details?: Record<string, unknown> | null;
  test_date?: string | null;
}

export interface BiasTestUpdate extends Partial<BiasTestInsert> {
  id: string;
}

// Sample data for demo when table doesn't exist
const DEMO_BIAS_TESTS: BiasTest[] = [
  {
    id: "demo-1",
    organization_id: "demo-org",
    model_id: "demo-model-1",
    test_type: "Demographic Parity",
    protected_attribute: "Gender",
    result: "pass",
    score: 0.92,
    threshold: 0.8,
    details: null,
    tested_by: null,
    test_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    models: { name: "GPT-4 Classifier" },
    profiles: { full_name: "Demo User" },
  },
  {
    id: "demo-2",
    organization_id: "demo-org",
    model_id: "demo-model-2",
    test_type: "Equal Opportunity",
    protected_attribute: "Age",
    result: "warning",
    score: 0.78,
    threshold: 0.8,
    details: null,
    tested_by: null,
    test_date: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    models: { name: "Risk Assessment Model" },
    profiles: { full_name: "Demo User" },
  },
  {
    id: "demo-3",
    organization_id: "demo-org",
    model_id: "demo-model-3",
    test_type: "Predictive Equality",
    protected_attribute: "Ethnicity",
    result: "fail",
    score: 0.65,
    threshold: 0.8,
    details: null,
    tested_by: null,
    test_date: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    models: { name: "Credit Scoring Model" },
    profiles: { full_name: "Demo User" },
  },
];

export function useBiasTests() {
  return useQuery({
    queryKey: ["bias-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bias_tests")
        .select("*, models(name), profiles:tested_by(full_name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Using demo bias tests data");
        return DEMO_BIAS_TESTS;
      }
      return data as BiasTest[];
    },
  });
}

export function useBiasTestsByModel(modelId: string) {
  return useQuery({
    queryKey: ["bias-tests", modelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bias_tests")
        .select("*, models(name), profiles:tested_by(full_name)")
        .eq("model_id", modelId)
        .order("test_date", { ascending: false });

      if (error) throw error;
      return data as BiasTest[];
    },
    enabled: !!modelId,
  });
}

export function useCreateBiasTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (test: BiasTestInsert) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, id")
        .single();

      const { data, error } = await supabase
        .from("bias_tests")
        .insert({
          ...test,
          organization_id: profile?.organization_id,
          tested_by: profile?.id,
          test_date: test.test_date || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bias-tests"] });
      toast.success("Bias test recorded successfully");
    },
    onError: (error) => {
      toast.error("Failed to record bias test: " + error.message);
    },
  });
}

export function useUpdateBiasTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: BiasTestUpdate) => {
      const { data, error } = await supabase
        .from("bias_tests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bias-tests"] });
      toast.success("Bias test updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update bias test: " + error.message);
    },
  });
}

export function useDeleteBiasTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bias_tests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bias-tests"] });
      toast.success("Bias test deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete bias test: " + error.message);
    },
  });
}
