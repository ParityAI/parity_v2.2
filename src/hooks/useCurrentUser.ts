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

      try {
        const [profileResult, roleResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("*, organizations(name)")
            .eq("user_id", user.id)
            .single(),
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single()
        ]);

        if (profileResult.error) {
          // Fallback for demo user without profile
          return {
            id: user.id,
            user_id: user.id,
            full_name: user.email?.split("@")[0] || "Demo User",
            email: user.email,
            avatar_url: null,
            organization_id: null,
            role: (roleResult.data?.role as UserRole) || "admin",
            organization_name: "Parity AI Demo",
          } as CurrentUser;
        }

        const profile = profileResult.data;
        const role = roleResult.data?.role || "user";

        return {
          id: profile.id,
          user_id: profile.user_id,
          full_name: profile.full_name,
          email: user.email,
          avatar_url: profile.avatar_url,
          organization_id: profile.organization_id,
          role: role as UserRole,
          organization_name: profile.organizations?.name || "Parity AI Demo",
        } as CurrentUser;
      } catch (error) {
        console.error("Current user error:", error);
        return {
          id: user.id,
          user_id: user.id,
          full_name: user.email?.split("@")[0] || "Demo User",
          email: user.email,
          avatar_url: null,
          organization_id: null,
          role: "admin" as UserRole,
          organization_name: "Parity AI Demo",
        } as CurrentUser;
      }
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
