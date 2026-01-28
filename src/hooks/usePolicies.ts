import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export function usePolicies() {
  return useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("policies")
        .select("*, profiles:owner_id(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Policy[];
    },
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policy: PolicyInsert) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .single();

      const { data, error } = await supabase
        .from("policies")
        .insert({
          ...policy,
          organization_id: profile?.organization_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
    mutationFn: async ({ id, ...updates }: PolicyUpdate) => {
      const { data, error } = await supabase
        .from("policies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("policies").delete().eq("id", id);
      if (error) throw error;
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
