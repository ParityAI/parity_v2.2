import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type NotificationType =
  | "task_assigned" | "deadline_approaching" | "incident_reported"
  | "assessment_required" | "policy_updated" | "system";

export interface Notification {
  id: string;
  organization_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n-1", organization_id: "demo-org", user_id: "demo",
    type: "incident_reported", title: "Critical Incident Reported",
    message: "A new critical severity incident has been reported for the Credit Scoring Model",
    link: "/incidents", is_read: false, entity_type: "incident", entity_id: "demo-1",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "n-2", organization_id: "demo-org", user_id: "demo",
    type: "deadline_approaching", title: "EU AI Act Assessment Due Soon",
    message: "Your EU AI Act compliance assessment is due in 5 days",
    link: "/compliance", is_read: false, entity_type: "assessment", entity_id: "demo-2",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "n-3", organization_id: "demo-org", user_id: "demo",
    type: "task_assigned", title: "New Task Assigned",
    message: "You have been assigned: Complete bias audit for credit model",
    link: "/tasks", is_read: true, entity_type: "task", entity_id: "demo-1",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "n-4", organization_id: "demo-org", user_id: "demo",
    type: "policy_updated", title: "Policy Updated",
    message: "AI Ethics & Responsible Use Policy has been updated to v2.1",
    link: "/policies", is_read: true, entity_type: "policy", entity_id: "demo-1",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => DEMO_NOTIFICATIONS,
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => DEMO_NOTIFICATIONS.filter(n => !n.is_read).length,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => { /* demo */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => { /* demo */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      toast.success("All notifications marked as read");
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_id: string) => { /* demo */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}

export function useNotificationsRealtime() {
  // No-op for demo
}
