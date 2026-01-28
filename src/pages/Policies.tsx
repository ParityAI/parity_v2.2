import { useState, useMemo } from "react";
import { Plus, Search, FileText, CheckCircle, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Policy {
  id: string;
  name: string;
  description: string;
  status: "draft" | "under_review" | "published" | "archived";
  version: string;
  category: string;
  owner: string;
  effectiveDate: string;
  reviewDate: string;
  linkedModels: number;
  createdAt: string;
  updatedAt: string;
}

const initialPolicies: Policy[] = [
  {
    id: "1",
    name: "AI Ethics Policy",
    description: "Defines ethical principles and guidelines for AI development and deployment",
    status: "published",
    version: "2.0",
    category: "Ethics",
    owner: "John Doe",
    effectiveDate: "2026-01-01",
    reviewDate: "2026-07-01",
    linkedModels: 4,
    createdAt: "2025-06-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "2",
    name: "AI Risk Management Policy",
    description: "Framework for identifying, assessing, and mitigating AI-related risks",
    status: "under_review",
    version: "1.1",
    category: "Risk Management",
    owner: "Jane Smith",
    effectiveDate: "2025-12-01",
    reviewDate: "2026-06-01",
    linkedModels: 3,
    createdAt: "2025-11-01",
    updatedAt: "2026-01-15",
  },
  {
    id: "3",
    name: "Data Privacy for AI Systems",
    description: "Privacy requirements and data handling procedures for AI systems",
    status: "published",
    version: "1.0",
    category: "Privacy",
    owner: "Mike Johnson",
    effectiveDate: "2025-09-01",
    reviewDate: "2026-03-01",
    linkedModels: 5,
    createdAt: "2025-08-01",
    updatedAt: "2025-09-01",
  },
  {
    id: "4",
    name: "Bias Testing Requirements",
    description: "Mandatory bias testing procedures for all AI hiring tools",
    status: "draft",
    version: "0.1",
    category: "Bias & Fairness",
    owner: "Sarah Wilson",
    effectiveDate: "",
    reviewDate: "",
    linkedModels: 0,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-18",
  },
];

const statusColors = {
  draft: "bg-gray-100 text-gray-700",
  under_review: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  archived: "bg-red-100 text-red-700",
};

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "draft" as Policy["status"],
    version: "1.0",
    category: "",
    owner: "",
    effectiveDate: "",
    reviewDate: "",
  });

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const matchesSearch =
        policy.name.toLowerCase().includes(search.toLowerCase()) ||
        policy.description.toLowerCase().includes(search.toLowerCase()) ||
        policy.owner.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || policy.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [policies, search, statusFilter]);

  const stats = useMemo(() => ({
    total: policies.length,
    published: policies.filter(p => p.status === "published").length,
    underReview: policies.filter(p => p.status === "under_review").length,
    draft: policies.filter(p => p.status === "draft").length,
  }), [policies]);

  const handleAddNew = () => {
    setEditingPolicy(null);
    setFormData({
      name: "",
      description: "",
      status: "draft",
      version: "1.0",
      category: "",
      owner: "",
      effectiveDate: "",
      reviewDate: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      status: policy.status,
      version: policy.version,
      category: policy.category,
      owner: policy.owner,
      effectiveDate: policy.effectiveDate,
      reviewDate: policy.reviewDate,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast({ title: "Error", description: "Policy name is required", variant: "destructive" });
      return;
    }

    const now = new Date().toISOString().split("T")[0];
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id
        ? { ...p, ...formData, updatedAt: now }
        : p
      ));
      toast({ title: "Policy updated", description: "The policy has been updated successfully." });
    } else {
      const newPolicy: Policy = {
        id: Date.now().toString(),
        ...formData,
        linkedModels: 0,
        createdAt: now,
        updatedAt: now,
      };
      setPolicies([newPolicy, ...policies]);
      toast({ title: "Policy created", description: "The policy has been created successfully." });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
    toast({ title: "Policy deleted", description: "The policy has been removed." });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Policy Manager</h1>
          <p className="text-muted-foreground">
            Create and manage AI governance policies for your organization
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Policy
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.underReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Linked Models</TableHead>
              <TableHead>Review Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{policy.name}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {policy.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">v{policy.version}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[policy.status]}>
                    {policy.status.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>{policy.category}</TableCell>
                <TableCell>{policy.owner}</TableCell>
                <TableCell>{policy.linkedModels}</TableCell>
                <TableCell>
                  {policy.reviewDate ? format(new Date(policy.reviewDate), "MMM d, yyyy") : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(policy)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(policy.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredPolicies.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No policies found
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
            <DialogTitle>{editingPolicy ? "Edit Policy" : "Create Policy"}</DialogTitle>
            <DialogDescription>
              {editingPolicy ? "Update the policy details below." : "Create a new governance policy."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Policy Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter policy name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the policy"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Policy["status"]) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g., 1.0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Ethics, Privacy, Risk"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Policy owner"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reviewDate">Review Date</Label>
                <Input
                  id="reviewDate"
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingPolicy ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
