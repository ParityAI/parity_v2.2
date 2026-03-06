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

const DEMO_EVIDENCE: Evidence[] = [
  {
    id: "demo-1", organization_id: "demo-org", name: "SOC 2 Type II Certification",
    description: "Annual SOC 2 compliance certification", file_url: null, file_type: "pdf",
    file_size: 2457600, evidence_type: "certification", category: "Compliance",
    model_id: null, vendor_id: null, assessment_id: null, uploaded_by: null,
    expires_at: "2027-03-15", created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    profiles: { full_name: "Sarah Johnson" },
  },
  {
    id: "demo-2", organization_id: "demo-org", name: "Bias Audit Report - Q4 2025",
    description: "Quarterly bias testing results", file_url: null, file_type: "pdf",
    file_size: 1843200, evidence_type: "audit_report", category: "Fairness",
    model_id: null, vendor_id: null, assessment_id: null, uploaded_by: null,
    expires_at: null, created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString(),
    profiles: { full_name: "Michael Chen" },
  },
];

export function useEvidence() {
  return useQuery({
    queryKey: ["evidence"],
    queryFn: async () => DEMO_EVIDENCE,
  });
}

export function useCreateEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_evidence: EvidenceInsert) => {
      throw new Error("Database table 'evidence' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast.success("Evidence uploaded successfully");
    },
    onError: (error) => toast.error("Failed to upload evidence: " + error.message),
  });
}

export function useUpdateEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_update: EvidenceUpdate) => {
      throw new Error("Database table 'evidence' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast.success("Evidence updated successfully");
    },
    onError: (error) => toast.error("Failed to update evidence: " + error.message),
  });
}

export function useDeleteEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error("Database table 'evidence' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast.success("Evidence deleted successfully");
    },
    onError: (error) => toast.error("Failed to delete evidence: " + error.message),
  });
}

export async function uploadEvidenceFile(_file: File): Promise<{ url: string; path: string } | null> {
  console.warn("Evidence storage not yet configured");
  return null;
}

export async function getEvidenceFileUrl(_filePath: string): Promise<string | null> {
  console.warn("Evidence storage not yet configured");
  return null;
}

export function useUploadEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: { file: File; evidence: EvidenceInsert }) => {
      throw new Error("Database table 'evidence' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast.success("Evidence uploaded successfully");
    },
    onError: (error) => toast.error("Failed to upload evidence: " + error.message),
  });
}
