import { useState, useMemo } from "react";
import { Search, Users, Shield, UserCog, Loader2, UserPlus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  useUsers,
  useUpdateUserRole,
  useUpdateProfile,
  UserProfile,
  UserRole,
} from "@/hooks/useUsers";
import { RequireRole } from "@/components/auth/RequireRole";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const roleColors: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  user: "bg-blue-100 text-blue-700",
  viewer: "bg-gray-100 text-gray-700",
};

const roleDescriptions: Record<UserRole, string> = {
  admin: "Full access to all features including user management",
  user: "Can create, edit, and manage compliance data",
  viewer: "Read-only access to dashboards and reports",
};

function UserManagementContent() {
  const { data: users = [], isLoading } = useUsers();
  const { data: currentUser } = useCurrentUser();
  const updateRole = useUpdateUserRole();
  const updateProfile = useUpdateProfile();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    role: "user" as UserRole,
  });

  // Generate invite link (users sign up at /auth and join the organization)
  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/auth?invite=true`
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        (user.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(search.toLowerCase());
      const userRole = user.user_roles?.[0]?.role || "user";
      const matchesRole = roleFilter === "all" || userRole === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const getRoleCount = (role: UserRole) =>
      users.filter(u => (u.user_roles?.[0]?.role || "user") === role).length;
    return {
      total: users.length,
      admins: getRoleCount("admin"),
      users: getRoleCount("user"),
      viewers: getRoleCount("viewer"),
    };
  }, [users]);

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || "",
      role: user.user_roles?.[0]?.role || "user",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    // Update profile name if changed
    if (formData.full_name !== editingUser.full_name) {
      await updateProfile.mutateAsync({
        id: editingUser.id,
        full_name: formData.full_name,
      });
    }

    // Update role if changed
    const currentRole = editingUser.user_roles?.[0]?.role || "user";
    if (formData.role !== currentRole) {
      await updateRole.mutateAsync({
        userId: editingUser.user_id,
        role: formData.role,
      });
    }

    setDialogOpen(false);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage team members and their access permissions
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Current User Info */}
      {currentUser && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Your Role: {currentUser.role}</AlertTitle>
          <AlertDescription>
            You are logged in as <strong>{currentUser.full_name || currentUser.email}</strong>
            {currentUser.organization_name && (
              <> in organization <strong>{currentUser.organization_name}</strong></>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <UserCog className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.viewers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Role Descriptions */}
      <div className="grid gap-4 md:grid-cols-3">
        {(["admin", "user", "viewer"] as UserRole[]).map((role) => (
          <Card key={role}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Badge className={roleColors[role]}>{role}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{roleDescriptions[role]}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const role = user.user_roles?.[0]?.role || "user";
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.full_name || "Unnamed User"}</div>
                        <div className="text-sm text-muted-foreground">{user.email || "-"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[role]}>{role}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="User's full name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">{roleDescriptions[formData.role]}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={updateRole.isPending || updateProfile.isPending}
            >
              {(updateRole.isPending || updateProfile.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>
              Share this link with team members to invite them to your organization.
              They will need to create an account to join.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Invitation Link</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyLink} variant="outline" className="shrink-0">
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Alert>
              <UserPlus className="h-4 w-4" />
              <AlertTitle>How it works</AlertTitle>
              <AlertDescription>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Share the link with your team member</li>
                  <li>They sign up using the link</li>
                  <li>They automatically join your organization</li>
                  <li>You can then set their role from this page</li>
                </ol>
              </AlertDescription>
            </Alert>
            <div className="grid gap-2">
              <Label>Default Role for New Users</Label>
              <p className="text-sm text-muted-foreground">
                New users are assigned the <Badge className={roleColors["user"]}>user</Badge> role by default.
                You can change their role after they join.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setInviteDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Wrap with role-based access control - only admins can access
export default function UserManagement() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <UserManagementContent />
    </RequireRole>
  );
}
