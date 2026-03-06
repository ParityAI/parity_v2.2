import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TaskStatus = "todo" | "in_progress" | "review" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string | null;
  assignee_id: string | null;
  due_date: string | null;
  model_id: string | null;
  vendor_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null } | null;
}

export interface TaskInsert {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string | null;
  assignee_id?: string | null;
  due_date?: string | null;
  model_id?: string | null;
  vendor_id?: string | null;
}

export interface TaskUpdate extends Partial<TaskInsert> {
  id: string;
}

// Sample data for demo when table doesn't exist
const DEMO_TASKS: Task[] = [
  {
    id: "demo-1",
    organization_id: "demo-org",
    title: "Complete bias audit for credit model",
    description: "Run comprehensive bias testing across all protected attributes",
    status: "in_progress",
    priority: "high",
    category: "Compliance",
    assignee_id: null,
    due_date: new Date(Date.now() + 604800000).toISOString(),
    model_id: null,
    vendor_id: null,
    created_by: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Sarah Johnson" },
  },
  {
    id: "demo-2",
    organization_id: "demo-org",
    title: "Review vendor security assessment",
    description: "Evaluate OpenAI API security documentation and SLA terms",
    status: "todo",
    priority: "medium",
    category: "Vendor Management",
    assignee_id: null,
    due_date: new Date(Date.now() + 1209600000).toISOString(),
    model_id: null,
    vendor_id: null,
    created_by: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: { full_name: "Michael Chen" },
  },
  {
    id: "demo-3",
    organization_id: "demo-org",
    title: "Update EU AI Act compliance checklist",
    description: "Incorporate latest guidance from Article 6 requirements",
    status: "completed",
    priority: "critical",
    category: "Regulatory",
    assignee_id: null,
    due_date: new Date(Date.now() - 86400000).toISOString(),
    model_id: null,
    vendor_id: null,
    created_by: null,
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Emily Davis" },
  },
];

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, profiles:assignee_id(full_name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Using demo tasks data");
        return DEMO_TASKS;
      }
      return data as Task[];
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: TaskInsert) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, id")
        .single();

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...task,
          organization_id: profile?.organization_id,
          created_by: profile?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create task: " + error.message);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TaskUpdate) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update task: " + error.message);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete task: " + error.message);
    },
  });
}
