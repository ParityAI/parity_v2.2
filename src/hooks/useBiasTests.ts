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

export function useBiasTests() {
  return useQuery({
    queryKey: ["bias-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bias_tests")
        .select("*, models(name), profiles:tested_by(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
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
