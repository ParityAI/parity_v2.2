import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type PolicyStatus = "draft" | "under_review" | "published" | "archived";

export interface Policy {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string | null;
  version: string | null;
  status: PolicyStatus;
  owner_id: string | null;
  effective_date: string | null;
  review_date: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null } | null;
}

export interface PolicyInsert {
  title: string;
  description?: string | null;
  content?: string | null;
  category?: string | null;
  version?: string | null;
  status?: PolicyStatus;
  owner_id?: string | null;
  effective_date?: string | null;
  review_date?: string | null;
}

export interface PolicyUpdate extends Partial<PolicyInsert> {
  id: string;
}

// Stub hooks - policies table needs to be created
export function usePolicies() {
  return useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      // Table doesn't exist yet - return empty array
      return [] as Policy[];
    },
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_policy: PolicyInsert) => {
      throw new Error("policies table not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success("Policy created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create policy: " + error.message);
    },
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_update: PolicyUpdate) => {
      throw new Error("policies table not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success("Policy updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update policy: " + error.message);
    },
  });
}

export function useDeletePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error("policies table not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success("Policy deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete policy: " + error.message);
    },
  });
}
