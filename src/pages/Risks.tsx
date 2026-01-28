import { useState, useMemo } from "react";
import { Plus, Search, AlertTriangle, Shield, Info } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Risk {
  id: string;
  name: string;
  description: string;
  severity: "negligible" | "minor" | "moderate" | "major" | "critical";
  riskLevel: "very_low" | "low" | "medium" | "high" | "very_high";
  mitigationStatus: "not_started" | "in_progress" | "requires_review" | "completed";
  owner: string;
  targetDate: string;
  controls: string[];
  category: string;
  createdAt: string;
}

const initialRisks: Risk[] = [
  {
    id: "1",
    name: "Algorithmic Bias in Candidate Screening",
    description: "Risk of discriminatory outcomes in AI-powered resume screening affecting protected groups",
    severity: "major",
    riskLevel: "high",
    mitigationStatus: "requires_review",
    owner: "John Doe",
    targetDate: "2026-02-16",
    controls: ["Bias testing", "Adverse impact analysis", "Human review"],
    category: "Bias & Fairness",
    createdAt: "2026-01-10",
  },
  {
    id: "2",
    name: "Bias in candidate ranking",
    description: "Potential disparate impact in candidate ranking algorithms",
    severity: "negligible",
    riskLevel: "very_low",
    mitigationStatus: "in_progress",
    owner: "Jane Smith",
    targetDate: "2026-01-17",
    controls: ["Regular monitoring", "Threshold adjustment"],
    category: "Bias & Fairness",
    createdAt: "2026-01-05",
  },
  {
    id: "3",
    name: "Bias in student performance prediction",
    description: "Risk of biased predictions affecting student opportunities",
    severity: "major",
    riskLevel: "high",
    mitigationStatus: "completed",
    owner: "Mike Johnson",
    targetDate: "2026-01-17",
    controls: ["Fairness constraints", "Regular audits"],
    category: "Bias & Fairness",
    createdAt: "2026-01-01",
  },
  {
    id: "4",
    name: "Data Privacy Breach",
    description: "Risk of unauthorized access to personal candidate data",
    severity: "critical",
    riskLevel: "very_high",
    mitigationStatus: "in_progress",
    owner: "Sarah Wilson",
    targetDate: "2026-02-01",
    controls: ["Encryption", "Access controls", "Audit logging"],
    category: "Security",
    createdAt: "2026-01-08",
  },
];

const severityColors = {
  negligible: "bg-gray-100 text-gray-700",
  minor: "bg-blue-100 text-blue-700",
  moderate: "bg-yellow-100 text-yellow-700",
  major: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const riskLevelColors = {
  very_low: "bg-green-100 text-green-700",
  low: "bg-green-50 text-green-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  very_high: "bg-red-100 text-red-700",
};

const mitigationColors = {
  not_started: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  requires_review: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
};

export default function Risks() {
  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [search, setSearch] = useState("");
  const [riskLevelFilter, setRiskLevelFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    severity: "moderate" as Risk["severity"],
    riskLevel: "medium" as Risk["riskLevel"],
    mitigationStatus: "not_started" as Risk["mitigationStatus"],
    owner: "",
    targetDate: "",
    category: "",
  });

  const filteredRisks = useMemo(() => {
    return risks.filter((risk) => {
      const matchesSearch =
        risk.name.toLowerCase().includes(search.toLowerCase()) ||
        risk.description.toLowerCase().includes(search.toLowerCase()) ||
        risk.owner.toLowerCase().includes(search.toLowerCase());
      const matchesRiskLevel = riskLevelFilter === "all" || risk.riskLevel === riskLevelFilter;
      return matchesSearch && matchesRiskLevel;
    });
  }, [risks, search, riskLevelFilter]);

  const stats = useMemo(() => ({
    veryHigh: risks.filter(r => r.riskLevel === "very_high").length,
    high: risks.filter(r => r.riskLevel === "high").length,
    medium: risks.filter(r => r.riskLevel === "medium").length,
    low: risks.filter(r => r.riskLevel === "low").length,
    veryLow: risks.filter(r => r.riskLevel === "very_low").length,
  }), [risks]);

  const handleAddNew = () => {
    setEditingRisk(null);
    setFormData({
      name: "",
      description: "",
      severity: "moderate",
      riskLevel: "medium",
      mitigationStatus: "not_started",
      owner: "",
      targetDate: "",
      category: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (risk: Risk) => {
    setEditingRisk(risk);
    setFormData({
      name: risk.name,
      description: risk.description,
      severity: risk.severity,
      riskLevel: risk.riskLevel,
      mitigationStatus: risk.mitigationStatus,
      owner: risk.owner,
      targetDate: risk.targetDate,
      category: risk.category,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }

    if (editingRisk) {
      setRisks(risks.map(r => r.id === editingRisk.id
        ? { ...r, ...formData, controls: editingRisk.controls }
        : r
      ));
      toast({ title: "Risk updated", description: "The risk has been updated successfully." });
    } else {
      const newRisk: Risk = {
        id: Date.now().toString(),
        ...formData,
        controls: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRisks([newRisk, ...risks]);
      toast({ title: "Risk created", description: "The risk has been created successfully." });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
    toast({ title: "Risk deleted", description: "The risk has been removed." });
  };

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
        <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Risk Level" />
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
              <TableHead>Owner</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Mitigation Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Target Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell>
                  <div className="max-w-[250px]">
                    <div className="font-medium truncate">{risk.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {risk.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{risk.owner}</TableCell>
                <TableCell>
                  <Badge className={severityColors[risk.severity]}>
                    {risk.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={mitigationColors[risk.mitigationStatus]}>
                    {risk.mitigationStatus.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={riskLevelColors[risk.riskLevel]}>
                    {risk.riskLevel.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(risk.targetDate), "dd-MM-yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(risk)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(risk.id)}>
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
              <Label htmlFor="name">Risk Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onValueChange={(value: Risk["severity"]) => setFormData({ ...formData, severity: value })}
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
                <Label>Risk Level</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value: Risk["riskLevel"]) => setFormData({ ...formData, riskLevel: value })}
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
                  value={formData.mitigationStatus}
                  onValueChange={(value: Risk["mitigationStatus"]) => setFormData({ ...formData, mitigationStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="requires_review">Requires Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Risk owner"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingRisk ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
