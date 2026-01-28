import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser, UserRole } from "@/hooks/useCurrentUser";
import { Loader2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: "redirect" | "message";
}

export function RequireRole({ children, allowedRoles, fallback = "message" }: RequireRoleProps) {
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    if (fallback === "redirect") {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
              {allowedRoles.includes("admin") && (
                <span className="block mt-2">
                  This page requires administrator privileges.
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Your current role: <strong className="capitalize">{user.role}</strong>
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
