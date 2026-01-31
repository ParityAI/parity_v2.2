import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Stub hooks - bias_tests table needs to be created
export function useBiasTests() {
  return useQuery({
    queryKey: ["bias-tests"],
    queryFn: async () => {
      // Table doesn't exist yet - return empty array
      return [] as BiasTest[];
    },
  });
}

export function useBiasTestsByModel(modelId: string) {
  return useQuery({
    queryKey: ["bias-tests", modelId],
    queryFn: async () => {
      // Table doesn't exist yet - return empty array
      return [] as BiasTest[];
    },
    enabled: !!modelId,
  });
}

export function useCreateBiasTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_test: BiasTestInsert) => {
      throw new Error("bias_tests table not yet created");
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
    mutationFn: async (_update: BiasTestUpdate) => {
      throw new Error("bias_tests table not yet created");
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
    mutationFn: async (_id: string) => {
      throw new Error("bias_tests table not yet created");
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
