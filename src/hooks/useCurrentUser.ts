import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "user" | "viewer";

export interface CurrentUser {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  organization_id: string | null;
  role: UserRole;
  organization_name: string | null;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(`
          *,
          organizations(name),
          user_roles(role)
        `)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      return {
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        email: user.email,
        avatar_url: profile.avatar_url,
        organization_id: profile.organization_id,
        role: (profile.user_roles?.[0]?.role || "user") as UserRole,
        organization_name: profile.organizations?.name || null,
      } as CurrentUser;
    },
  });
}

export function useIsAdmin() {
  const { data: user } = useCurrentUser();
  return user?.role === "admin";
}

export function useHasRole(allowedRoles: UserRole[]) {
  const { data: user } = useCurrentUser();
  return user ? allowedRoles.includes(user.role) : false;
}
