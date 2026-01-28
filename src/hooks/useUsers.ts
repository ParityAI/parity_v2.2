import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserRole = "admin" | "user" | "viewer";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
  user_roles?: { role: UserRole }[];
  email?: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        // Get the current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No authenticated user");
          return [];
        }

        // Get the current user's profile to find their organization
        const { data: currentProfile, error: profileError } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          return [];
        }

        if (!currentProfile?.organization_id) {
          console.log("No organization found");
          return [];
        }

        // Get all profiles in the same organization with their roles
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            user_id,
            full_name,
            avatar_url,
            organization_id,
            created_at,
            updated_at,
            user_roles (role)
          `)
          .eq("organization_id", currentProfile.organization_id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching users:", error);
          throw error;
        }

        return (data || []) as UserProfile[];
      } catch (error) {
        console.error("useUsers error:", error);
        return [];
      }
    },
    retry: 1,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            user_id,
            full_name,
            avatar_url,
            organization_id,
            created_at,
            updated_at,
            user_roles (role)
          `)
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Current user error:", error);
          return null;
        }

        return { ...data, email: user.email } as UserProfile;
      } catch (error) {
        console.error("useCurrentUser error:", error);
        return null;
      }
    },
    retry: 1,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      // First check if user has a role
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existing) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update role: " + error.message);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, full_name }: { id: string; full_name: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
    },
  });
}
