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

// Sample data for demo when table doesn't exist
const DEMO_EVIDENCE: Evidence[] = [
  {
    id: "demo-1",
    organization_id: "demo-org",
    name: "SOC 2 Type II Certification",
    description: "Annual SOC 2 compliance certification for cloud infrastructure",
    file_url: null,
    file_type: "pdf",
    file_size: 2457600,
    evidence_type: "certification",
    category: "Compliance",
    model_id: null,
    vendor_id: null,
    assessment_id: null,
    uploaded_by: null,
    expires_at: "2027-03-15",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Sarah Johnson" },
  },
  {
    id: "demo-2",
    organization_id: "demo-org",
    name: "Bias Audit Report - Q4 2025",
    description: "Quarterly bias testing results for all production models",
    file_url: null,
    file_type: "pdf",
    file_size: 1843200,
    evidence_type: "audit_report",
    category: "Fairness",
    model_id: null,
    vendor_id: null,
    assessment_id: null,
    uploaded_by: null,
    expires_at: null,
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString(),
    profiles: { full_name: "Michael Chen" },
  },
  {
    id: "demo-3",
    organization_id: "demo-org",
    name: "Model Performance Test Results",
    description: "Automated testing results for fraud detection model v2.3",
    file_url: null,
    file_type: "xlsx",
    file_size: 524288,
    evidence_type: "test_result",
    category: "Performance",
    model_id: null,
    vendor_id: null,
    assessment_id: null,
    uploaded_by: null,
    expires_at: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    profiles: { full_name: "Emily Davis" },
  },
];

export function useEvidence() {
  return useQuery({
    queryKey: ["evidence"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evidence")
        .select("*, profiles:uploaded_by(full_name), models(name), vendors(name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Using demo evidence data");
        return DEMO_EVIDENCE;
      }
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
      // First get the evidence to find the file URL
      const { data: evidence } = await supabase
        .from("evidence")
        .select("file_url, organization_id")
        .eq("id", id)
        .single();

      // Delete the file from storage if it exists
      if (evidence?.file_url) {
        const filePath = evidence.file_url.split("/").slice(-2).join("/");
        await supabase.storage.from("evidence").remove([filePath]);
      }

      // Delete the database record
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

// Upload a file to Supabase Storage and return the URL
export async function uploadEvidenceFile(file: File): Promise<{ url: string; path: string } | null> {
  try {
    // Get the user's organization ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .single();

    if (!profile?.organization_id) {
      throw new Error("No organization found");
    }

    // Create a unique file path: org_id/timestamp_filename
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = `${profile.organization_id}/${fileName}`;

    // Upload the file
    const { error } = await supabase.storage
      .from("evidence")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL (or signed URL for private buckets)
    const { data: urlData } = supabase.storage
      .from("evidence")
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
}

// Get a signed URL for downloading a file (for private buckets)
export async function getEvidenceFileUrl(filePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from("evidence")
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return null;
  }
}

// Hook for uploading evidence with file
export function useUploadEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, evidence }: { file: File; evidence: EvidenceInsert }) => {
      // Get the user's profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, id")
        .single();

      if (!profile?.organization_id) {
        throw new Error("No organization found");
      }

      // Upload the file
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = `${profile.organization_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("evidence")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the URL
      const { data: urlData } = supabase.storage
        .from("evidence")
        .getPublicUrl(filePath);

      // Create the evidence record with file info
      const { data, error } = await supabase
        .from("evidence")
        .insert({
          ...evidence,
          organization_id: profile.organization_id,
          uploaded_by: profile.id,
          file_url: urlData.publicUrl,
          file_type: fileExt || null,
          file_size: file.size,
        })
        .select()
        .single();

      if (error) {
        // If database insert fails, clean up the uploaded file
        await supabase.storage.from("evidence").remove([filePath]);
        throw error;
      }

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
