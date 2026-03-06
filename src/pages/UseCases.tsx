import { useState, useMemo } from "react";
import { Plus, Search, Target, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import {
  useUseCases,
  useCreateUseCase,
  useUpdateUseCase,
  useDeleteUseCase,
  UseCase,
  UseCaseStatus,
  UseCaseRisk,
} from "@/hooks/useUseCases";

const statusColors: Record<UseCaseStatus, string> = {
  not_started: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-yellow-100 text-yellow-800",
};

const riskColors: Record<UseCaseRisk, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export default function UseCases() {
  const { data: useCases = [], isLoading } = useUseCases();
  const createUseCase = useCreateUseCase();
  const updateUseCase = useUpdateUseCase();
  const deleteUseCase = useDeleteUseCase();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUseCase, setEditingUseCase] = useState<UseCase | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "not_started" as UseCaseStatus,
    progress: 0,
    risk_level: "medium" as UseCaseRisk,
    department: "",
    owner_name: "",
  });

  const filteredUseCases = useMemo(() => {
    return useCases.filter((uc) => {
      const matchesSearch =
        uc.name.toLowerCase().includes(search.toLowerCase()) ||
        (uc.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (uc.owner_name?.toLowerCase() || "").includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || uc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [useCases, search, statusFilter]);

  const stats = useMemo(() => ({
    total: useCases.length,
    notStarted: useCases.filter(u => u.status === "not_started").length,
    inProgress: useCases.filter(u => u.status === "in_progress").length,
    completed: useCases.filter(u => u.status === "completed").length,
    highRisk: useCases.filter(u => u.risk_level === "high").length,
  }), [useCases]);

  const handleAddNew = () => {
    setEditingUseCase(null);
    setFormData({
      name: "",
      description: "",
      status: "not_started",
      progress: 0,
      risk_level: "medium",
      department: "",
      owner_name: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (useCase: UseCase) => {
    setEditingUseCase(useCase);
    setFormData({
      name: useCase.name,
      description: useCase.description || "",
      status: useCase.status,
      progress: useCase.progress,
      risk_level: useCase.risk_level,
      department: useCase.department || "",
      owner_name: useCase.owner_name || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;

    const useCaseData = {
      name: formData.name,
      description: formData.description || null,
      status: formData.status,
      progress: formData.progress,
      risk_level: formData.risk_level,
      department: formData.department || null,
      owner_name: formData.owner_name || null,
    };

    if (editingUseCase) {
      await updateUseCase.mutateAsync({ id: editingUseCase.id, ...useCaseData });
    } else {
      await createUseCase.mutateAsync(useCaseData);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteUseCase.mutateAsync(id);
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
          <h1 className="text-2xl font-semibold text-foreground">Use Cases</h1>
          <p className="text-muted-foreground">
            Document and track AI system use cases across your organization
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Use Case
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Use Cases</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search use cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUseCases.map((useCase) => (
              <TableRow key={useCase.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{useCase.name}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {useCase.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={useCase.progress} className="w-[60px]" />
                    <span className="text-sm text-muted-foreground">{useCase.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[useCase.status]}>
                    {useCase.status.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={riskColors[useCase.risk_level]}>
                    {useCase.risk_level}
                  </Badge>
                </TableCell>
                <TableCell>{useCase.owner_name || "-"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(useCase.updated_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(useCase)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete(useCase.id)}
                    disabled={deleteUseCase.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredUseCases.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No use cases found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUseCase ? "Edit Use Case" : "Add Use Case"}</DialogTitle>
            <DialogDescription>
              {editingUseCase ? "Update the use case details below." : "Document a new AI use case."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Use case name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the AI use case"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: UseCaseStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Risk Level</Label>
                <Select
                  value={formData.risk_level}
                  onValueChange={(value: UseCaseRisk) => setFormData({ ...formData, risk_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="owner_name">Owner</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  placeholder="Owner name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Department"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={createUseCase.isPending || updateUseCase.isPending || !formData.name}
            >
              {(createUseCase.isPending || updateUseCase.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingUseCase ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
