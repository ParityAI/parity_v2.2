import { useState, useMemo } from "react";
import { Upload, Search, FileText, File, Download, Trash2, Info, Loader2 } from "lucide-react";
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
  useEvidence,
  useCreateEvidence,
  useUpdateEvidence,
  useDeleteEvidence,
  type Evidence as EvidenceItem,
  type EvidenceType,
} from "@/hooks/useEvidence";

const typeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  csv: File,
  doc: FileText,
  xlsx: File,
  document: FileText,
  screenshot: File,
  audit_report: FileText,
  certification: FileText,
  test_result: File,
  other: File,
};

const typeColors: Record<EvidenceType, string> = {
  document: "bg-blue-100 text-blue-700",
  screenshot: "bg-purple-100 text-purple-700",
  audit_report: "bg-green-100 text-green-700",
  certification: "bg-yellow-100 text-yellow-700",
  test_result: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-700",
};

export default function Evidence() {
  const { data: evidence = [], isLoading } = useEvidence();
  const createEvidence = useCreateEvidence();
  const updateEvidence = useUpdateEvidence();
  const deleteEvidence = useDeleteEvidence();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    evidence_type: "document" as EvidenceType,
    category: "",
    file_type: "",
    expires_at: "",
  });

  const filteredEvidence = useMemo(() => {
    return evidence.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description?.toLowerCase() || "").includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.evidence_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [evidence, search, typeFilter]);

  const stats = useMemo(() => ({
    total: evidence.length,
    documents: evidence.filter(e => e.evidence_type === "document").length,
    auditReports: evidence.filter(e => e.evidence_type === "audit_report").length,
    certifications: evidence.filter(e => e.evidence_type === "certification").length,
    testResults: evidence.filter(e => e.evidence_type === "test_result").length,
  }), [evidence]);

  const handleAddNew = () => {
    setEditingEvidence(null);
    setFormData({
      name: "",
      description: "",
      evidence_type: "document",
      category: "",
      file_type: "",
      expires_at: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: EvidenceItem) => {
    setEditingEvidence(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      evidence_type: item.evidence_type,
      category: item.category || "",
      file_type: item.file_type || "",
      expires_at: item.expires_at || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;

    const evidenceData = {
      name: formData.name,
      description: formData.description || null,
      evidence_type: formData.evidence_type,
      category: formData.category || null,
      file_type: formData.file_type || null,
      expires_at: formData.expires_at || null,
    };

    if (editingEvidence) {
      await updateEvidence.mutateAsync({ id: editingEvidence.id, ...evidenceData });
    } else {
      await createEvidence.mutateAsync(evidenceData);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteEvidence.mutateAsync(id);
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
          <h1 className="text-2xl font-semibold text-foreground">Evidence Hub</h1>
          <p className="text-muted-foreground">
            Manage compliance documents, audit reports, and certifications
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Evidence
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Document management for AI compliance</AlertTitle>
        <AlertDescription>
          Store and organize all evidence required for regulatory compliance, including bias audit reports,
          model documentation, vendor certifications, and training records.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.documents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Audit Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.auditReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.certifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.testResults}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="audit_report">Audit Reports</SelectItem>
            <SelectItem value="certification">Certifications</SelectItem>
            <SelectItem value="test_result">Test Results</SelectItem>
            <SelectItem value="screenshot">Screenshots</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Linked To</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvidence.map((item) => {
              const Icon = typeIcons[item.evidence_type] || File;
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[item.evidence_type]}>
                      {item.evidence_type.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.category ? (
                      <Badge variant="outline">{item.category}</Badge>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    {item.models?.name || item.vendors?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {item.expires_at ? format(new Date(item.expires_at), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteEvidence.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredEvidence.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No evidence found
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
            <DialogTitle>{editingEvidence ? "Edit Evidence" : "Upload Evidence"}</DialogTitle>
            <DialogDescription>
              {editingEvidence ? "Update the evidence details." : "Add new evidence to the hub."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Evidence name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this evidence"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Evidence Type</Label>
                <Select
                  value={formData.evidence_type}
                  onValueChange={(value: EvidenceType) => setFormData({ ...formData, evidence_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="audit_report">Audit Report</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="test_result">Test Result</SelectItem>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Compliance, Legal"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="file_type">File Type</Label>
                <Input
                  id="file_type"
                  value={formData.file_type}
                  onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                  placeholder="e.g., pdf, csv, xlsx"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expires_at">Expiration Date</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={createEvidence.isPending || updateEvidence.isPending}
            >
              {(createEvidence.isPending || updateEvidence.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingEvidence ? "Update" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
