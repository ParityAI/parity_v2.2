import { useState, useMemo } from "react";
import { Plus, Search, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  useRisks,
  useCreateRisk,
  useUpdateRisk,
  useDeleteRisk,
  Risk,
  RiskSeverity,
  RiskLikelihood,
  MitigationStatus,
} from "@/hooks/useRisks";

const severityColors: Record<RiskSeverity, string> = {
  negligible: "bg-gray-100 text-gray-700",
  minor: "bg-blue-100 text-blue-700",
  moderate: "bg-yellow-100 text-yellow-700",
  major: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const likelihoodColors: Record<RiskLikelihood, string> = {
  very_low: "bg-green-100 text-green-700",
  low: "bg-green-50 text-green-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  very_high: "bg-red-100 text-red-700",
};

const mitigationColors: Record<MitigationStatus, string> = {
  not_started: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  accepted: "bg-purple-100 text-purple-700",
};

export default function Risks() {
  const { data: risks = [], isLoading } = useRisks();
  const createRisk = useCreateRisk();
  const updateRisk = useUpdateRisk();
  const deleteRisk = useDeleteRisk();

  const [search, setSearch] = useState("");
  const [likelihoodFilter, setLikelihoodFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    severity: "moderate" as RiskSeverity,
    likelihood: "medium" as RiskLikelihood,
    mitigation_status: "not_started" as MitigationStatus,
    mitigation_plan: "",
    review_date: "",
  });

  const filteredRisks = useMemo(() => {
    return risks.filter((risk) => {
      const matchesSearch =
        risk.title.toLowerCase().includes(search.toLowerCase()) ||
        (risk.description?.toLowerCase() || "").includes(search.toLowerCase());
      const matchesLikelihood = likelihoodFilter === "all" || risk.likelihood === likelihoodFilter;
      return matchesSearch && matchesLikelihood;
    });
  }, [risks, search, likelihoodFilter]);

  const stats = useMemo(() => ({
    veryHigh: risks.filter(r => r.likelihood === "very_high").length,
    high: risks.filter(r => r.likelihood === "high").length,
    medium: risks.filter(r => r.likelihood === "medium").length,
    low: risks.filter(r => r.likelihood === "low").length,
    veryLow: risks.filter(r => r.likelihood === "very_low").length,
  }), [risks]);

  const handleAddNew = () => {
    setEditingRisk(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      severity: "moderate",
      likelihood: "medium",
      mitigation_status: "not_started",
      mitigation_plan: "",
      review_date: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (risk: Risk) => {
    setEditingRisk(risk);
    setFormData({
      title: risk.title,
      description: risk.description || "",
      category: risk.category || "",
      severity: risk.severity,
      likelihood: risk.likelihood,
      mitigation_status: risk.mitigation_status,
      mitigation_plan: risk.mitigation_plan || "",
      review_date: risk.review_date || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) return;

    const riskData = {
      title: formData.title,
      description: formData.description || null,
      category: formData.category || null,
      severity: formData.severity,
      likelihood: formData.likelihood,
      mitigation_status: formData.mitigation_status,
      mitigation_plan: formData.mitigation_plan || null,
      review_date: formData.review_date || null,
    };

    if (editingRisk) {
      await updateRisk.mutateAsync({ id: editingRisk.id, ...riskData });
    } else {
      await createRisk.mutateAsync(riskData);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteRisk.mutateAsync(id);
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
          <h1 className="text-2xl font-semibold text-foreground">Risk Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor risks across all your AI projects
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Risk
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Risk identification is the foundation of responsible AI</AlertTitle>
        <AlertDescription>
          AI systems introduce unique risks around bias, privacy, security, and accuracy.
          Proactively identifying these risks before deployment prevents incidents and builds stakeholder trust.
        </AlertDescription>
      </Alert>

      {/* Risk Level Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Very High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.veryHigh}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.high}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Medium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.medium}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.low}</div>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-500">Very Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.veryLow}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search risks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={likelihoodFilter} onValueChange={setLikelihoodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Likelihood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="very_high">Very High</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="very_low">Very Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Risk Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Likelihood</TableHead>
              <TableHead>Mitigation Status</TableHead>
              <TableHead>Review Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell>
                  <div className="max-w-[250px]">
                    <div className="font-medium truncate">{risk.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {risk.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {risk.category ? (
                    <Badge variant="outline">{risk.category}</Badge>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  <Badge className={severityColors[risk.severity]}>
                    {risk.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={likelihoodColors[risk.likelihood]}>
                    {risk.likelihood.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={mitigationColors[risk.mitigation_status]}>
                    {risk.mitigation_status.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {risk.review_date ? format(new Date(risk.review_date), "MMM d, yyyy") : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(risk)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete(risk.id)}
                    disabled={deleteRisk.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredRisks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No risks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingRisk ? "Edit Risk" : "Add New Risk"}</DialogTitle>
            <DialogDescription>
              {editingRisk ? "Update the risk details below." : "Document a new risk for tracking and mitigation."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Risk Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter risk name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the risk and its potential impact"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: RiskSeverity) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negligible">Negligible</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Likelihood</Label>
                <Select
                  value={formData.likelihood}
                  onValueChange={(value: RiskLikelihood) => setFormData({ ...formData, likelihood: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_low">Very Low</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="very_high">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Mitigation Status</Label>
                <Select
                  value={formData.mitigation_status}
                  onValueChange={(value: MitigationStatus) => setFormData({ ...formData, mitigation_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Bias, Security, Privacy"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mitigation_plan">Mitigation Plan</Label>
              <Textarea
                id="mitigation_plan"
                value={formData.mitigation_plan}
                onChange={(e) => setFormData({ ...formData, mitigation_plan: e.target.value })}
                placeholder="Describe the mitigation strategy"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review_date">Review Date</Label>
              <Input
                id="review_date"
                type="date"
                value={formData.review_date}
                onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={createRisk.isPending || updateRisk.isPending}
            >
              {(createRisk.isPending || updateRisk.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingRisk ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
