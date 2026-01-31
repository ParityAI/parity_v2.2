import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Stub hooks - evidence table needs to be created
export function useEvidence() {
  return useQuery({
    queryKey: ["evidence"],
    queryFn: async () => {
      // Table doesn't exist yet - return empty array
      return [] as Evidence[];
    },
  });
}

export function useCreateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_evidence: EvidenceInsert) => {
      throw new Error("evidence table not yet created");
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
    mutationFn: async (_update: EvidenceUpdate) => {
      throw new Error("evidence table not yet created");
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
    mutationFn: async (_id: string) => {
      throw new Error("evidence table not yet created");
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
