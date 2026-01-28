import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ComplianceFramework {
  id: string;
  name: string;
  short_name: string;
  region: string;
  description: string | null;
  is_active: boolean | null;
  created_at: string;
}

export interface FrameworkChecklist {
  id: string;
  framework_id: string;
  item_text: string;
  category: string | null;
  sort_order: number | null;
  created_at: string;
}

export interface ComplianceAssessment {
  id: string;
  framework_id: string | null;
  model_id: string | null;
  organization_id: string | null;
  status: string;
  score: number | null;
  notes: string | null;
  deadline: string | null;
  checklist_progress: string[];
  assessed_at: string | null;
  assessed_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useComplianceFrameworks() {
  return useQuery({
    queryKey: ["compliance-frameworks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compliance_frameworks")
        .select("*")
        .eq("is_active", true)
        .order("region", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data as ComplianceFramework[];
    },
  });
}

export function useFrameworkChecklists(frameworkId: string | null) {
  return useQuery({
    queryKey: ["framework-checklists", frameworkId],
    queryFn: async () => {
      if (!frameworkId) return [];
      
      const { data, error } = await supabase
        .from("framework_checklists")
        .select("*")
        .eq("framework_id", frameworkId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as FrameworkChecklist[];
    },
    enabled: !!frameworkId,
  });
}

export function useAllFrameworkChecklists() {
  return useQuery({
    queryKey: ["all-framework-checklists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("framework_checklists")
        .select("*")
        .order("framework_id", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as FrameworkChecklist[];
    },
  });
}

export function useComplianceAssessments() {
  return useQuery({
    queryKey: ["compliance-assessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compliance_assessments")
        .select("*, compliance_frameworks(name, short_name, region)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessment: {
      framework_id: string;
      status?: string;
      deadline?: string | null;
      checklist_progress?: string[];
    }) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .single();

      const { data, error } = await supabase
        .from("compliance_assessments")
        .insert({
          ...assessment,
          organization_id: profile?.organization_id,
          status: assessment.status || "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-assessments"] });
      toast.success("Assessment created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create assessment: " + error.message);
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      status?: string;
      score?: number | null;
      deadline?: string | null;
      checklist_progress?: string[];
      notes?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("compliance_assessments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-assessments"] });
      toast.success("Assessment updated");
    },
    onError: (error) => {
      toast.error("Failed to update assessment: " + error.message);
    },
  });
}
