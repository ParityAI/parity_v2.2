import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type EvidenceType = "document" | "screenshot" | "audit_report" | "certification" | "test_result" | "other";

export interface Evidence {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  evidence_type: EvidenceType;
  category: string | null;
  model_id: string | null;
  vendor_id: string | null;
  assessment_id: string | null;
  uploaded_by: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null } | null;
  models?: { name: string } | null;
  vendors?: { name: string } | null;
}

export interface EvidenceInsert {
  name: string;
  description?: string | null;
  file_url?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  evidence_type?: EvidenceType;
  category?: string | null;
  model_id?: string | null;
  vendor_id?: string | null;
  assessment_id?: string | null;
  expires_at?: string | null;
}

export interface EvidenceUpdate extends Partial<EvidenceInsert> {
  id: string;
}

export function useEvidence() {
  return useQuery({
    queryKey: ["evidence"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evidence")
        .select("*, profiles:uploaded_by(full_name), models(name), vendors(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Evidence[];
    },
  });
}

export function useCreateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evidence: EvidenceInsert) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, id")
        .single();

      const { data, error } = await supabase
        .from("evidence")
        .insert({
          ...evidence,
          organization_id: profile?.organization_id,
          uploaded_by: profile?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast.success("Evidence uploaded successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload evidence: " + error.message);
    },
  });
}

export function useUpdateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: EvidenceUpdate) => {
      const { data, error } = await supabase
        .from("evidence")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast.success("Evidence updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update evidence: " + error.message);
    },
  });
}

export function useDeleteEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("evidence").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast.success("Evidence deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete evidence: " + error.message);
    },
  });
}
