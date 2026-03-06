import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const DEMO_TASKS: Task[] = [
  {
    id: "demo-1", organization_id: "demo-org", title: "Complete bias audit for credit model",
    description: "Run comprehensive bias testing", status: "in_progress", priority: "high",
    category: "Compliance", assignee_id: null,
    due_date: new Date(Date.now() + 604800000).toISOString(),
    model_id: null, vendor_id: null, created_by: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
    profiles: { full_name: "Sarah Johnson" },
  },
  {
    id: "demo-2", organization_id: "demo-org", title: "Review vendor security assessment",
    description: "Evaluate OpenAI API security documentation", status: "todo", priority: "medium",
    category: "Vendor Management", assignee_id: null,
    due_date: new Date(Date.now() + 1209600000).toISOString(),
    model_id: null, vendor_id: null, created_by: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: { full_name: "Michael Chen" },
  },
];

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => DEMO_TASKS,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_task: TaskInsert) => {
      throw new Error("Database table 'tasks' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
    },
    onError: (error) => toast.error("Failed to create task: " + error.message),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_update: TaskUpdate) => {
      throw new Error("Database table 'tasks' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
    },
    onError: (error) => toast.error("Failed to update task: " + error.message),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => {
      throw new Error("Database table 'tasks' not yet created");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error) => toast.error("Failed to delete task: " + error.message),
  });
}
