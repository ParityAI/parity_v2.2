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

// Stub hooks - tasks table needs to be created
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      // Table doesn't exist yet - return empty array
      return [] as Task[];
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_task: TaskInsert) => {
      throw new Error("tasks table not yet created");
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
    mutationFn: async (_update: TaskUpdate) => {
      throw new Error("tasks table not yet created");
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
    mutationFn: async (_id: string) => {
      throw new Error("tasks table not yet created");
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
