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

const DEMO_POLICIES: Policy[] = [
  {
    id: "demo-1", organization_id: "demo-org",
    title: "AI Ethics & Responsible Use Policy",
    description: "Defines ethical guidelines for AI development and deployment across the organization",
    content: "This policy establishes the ethical principles...",
    category: "Ethics", version: "2.1", status: "published",
    owner_id: null, effective_date: "2025-01-15", review_date: "2026-07-15",
    approved_by: null, approved_at: "2025-01-10",
    created_at: new Date(Date.now() - 5184000000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Sarah Johnson" },
  },
  {
    id: "demo-2", organization_id: "demo-org",
    title: "AI Model Risk Management Framework",
    description: "Framework for assessing and mitigating risks associated with AI/ML models",
    content: "This framework outlines the risk management process...",
    category: "Risk Management", version: "1.3", status: "published",
    owner_id: null, effective_date: "2025-03-01", review_date: "2026-09-01",
    approved_by: null, approved_at: "2025-02-25",
    created_at: new Date(Date.now() - 3456000000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Michael Chen" },
  },
  {
    id: "demo-3", organization_id: "demo-org",
    title: "Data Privacy & AI Training Data Policy",
    description: "Guidelines for handling personal data in AI training and inference",
    content: "This policy governs the use of personal data...",
    category: "Privacy", version: "1.0", status: "under_review",
    owner_id: null, effective_date: null, review_date: "2026-04-01",
    approved_by: null, approved_at: null,
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Emily Davis" },
  },
  {
    id: "demo-4", organization_id: "demo-org",
    title: "Third-Party AI Vendor Assessment Policy",
    description: "Requirements for evaluating and onboarding third-party AI vendors",
    content: null,
    category: "Vendor Management", version: "0.1", status: "draft",
    owner_id: null, effective_date: null, review_date: null,
    approved_by: null, approved_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    profiles: { full_name: "Demo Admin" },
  },
  {
    id: "demo-5", organization_id: "demo-org",
    title: "AI Incident Response Procedure",
    description: "Step-by-step procedure for responding to AI-related incidents",
    content: "This procedure defines escalation paths...",
    category: "Incident Response", version: "1.0", status: "published",
    owner_id: null, effective_date: "2025-06-01", review_date: "2026-06-01",
    approved_by: null, approved_at: "2025-05-28",
    created_at: new Date(Date.now() - 8640000000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Sarah Johnson" },
  },
];

export function usePolicies() {
  return useQuery({
    queryKey: ["policies"],
    queryFn: async () => DEMO_POLICIES,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_policy: PolicyInsert) => {
      throw new Error("Database table 'policies' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success("Policy created successfully");
    },
    onError: (error) => toast.error("Failed to create policy: " + error.message),
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_update: PolicyUpdate) => {
      throw new Error("Database table 'policies' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success("Policy updated successfully");
    },
    onError: (error) => toast.error("Failed to update policy: " + error.message),
  });
}

export function useDeletePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error("Database table 'policies' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      toast.success("Policy deleted successfully");
    },
    onError: (error) => toast.error("Failed to delete policy: " + error.message),
  });
}
