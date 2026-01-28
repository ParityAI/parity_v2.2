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

        // Get all profiles in the same organization
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select(`
            id,
            user_id,
            full_name,
            avatar_url,
            organization_id,
            created_at,
            updated_at
          `)
          .eq("organization_id", currentProfile.organization_id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching users:", error);
          throw error;
        }

        if (!profiles || profiles.length === 0) {
          return [];
        }

        // Get roles for all users separately
        const userIds = profiles.map(p => p.user_id);
        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", userIds);

        // Map roles to profiles
        const rolesMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

        return profiles.map(profile => ({
          ...profile,
          user_roles: rolesMap.has(profile.user_id)
            ? [{ role: rolesMap.get(profile.user_id) as UserRole }]
            : [{ role: "user" as UserRole }],
        })) as UserProfile[];
      } catch (error) {
        console.error("useUsers error:", error);
        return [];
      }
    },
    retry: 1,
  });
}

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ["current-user-profile"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Query profile and role separately
        const [profileResult, roleResult] = await Promise.all([
          supabase
            .from("profiles")
            .select(`
              id,
              user_id,
              full_name,
              avatar_url,
              organization_id,
              created_at,
              updated_at
            `)
            .eq("user_id", user.id)
            .single(),
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single()
        ]);

        if (profileResult.error) {
          console.error("Current user error:", profileResult.error);
          return null;
        }

        const profile = profileResult.data;
        const role = roleResult.data?.role || "user";

        return {
          ...profile,
          email: user.email,
          user_roles: [{ role: role as UserRole }],
        } as UserProfile;
      } catch (error) {
        console.error("useCurrentUserProfile error:", error);
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
