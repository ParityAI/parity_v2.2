import { useState, useMemo, useRef } from "react";
import { Upload, Search, FileText, File, Trash2, Info, Loader2, ExternalLink } from "lucide-react";
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
  useUploadEvidence,
  Evidence,
  EvidenceType,
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

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EvidencePage() {
  const { data: evidence = [], isLoading } = useEvidence();
  const createEvidence = useCreateEvidence();
  const updateEvidence = useUpdateEvidence();
  const deleteEvidence = useDeleteEvidence();
  const uploadEvidence = useUploadEvidence();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    evidence_type: "document" as EvidenceType,
    category: "",
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
    setSelectedFile(null);
    setFormData({
      name: "",
      description: "",
      evidence_type: "document",
      category: "",
      expires_at: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Evidence) => {
    setEditingEvidence(item);
    setSelectedFile(null);
    setFormData({
      name: item.name,
      description: item.description || "",
      evidence_type: item.evidence_type,
      category: item.category || "",
      expires_at: item.expires_at || "",
    });
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill name from filename if empty
      if (!formData.name) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setFormData({ ...formData, name: nameWithoutExt });
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name) return;

    const evidenceData = {
      name: formData.name,
      description: formData.description || null,
      evidence_type: formData.evidence_type,
      category: formData.category || null,
      expires_at: formData.expires_at || null,
    };

    if (editingEvidence) {
      // Update existing (file upload not supported for edits in this version)
      await updateEvidence.mutateAsync({ id: editingEvidence.id, ...evidenceData });
    } else if (selectedFile) {
      // Create with file upload
      await uploadEvidence.mutateAsync({ file: selectedFile, evidence: evidenceData });
    } else {
      // Create without file (metadata only)
      await createEvidence.mutateAsync(evidenceData);
    }
    setDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    await deleteEvidence.mutateAsync(id);
  };

  const handleDownload = (item: Evidence) => {
    if (item.file_url) {
      window.open(item.file_url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isUploading = uploadEvidence.isPending;
  const isSaving = createEvidence.isPending || updateEvidence.isPending || isUploading;

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
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvidence.map((item) => {
              const Icon = typeIcons[item.file_type || ""] || typeIcons[item.evidence_type] || File;
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
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(item.file_size)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {item.expires_at ? format(new Date(item.expires_at), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.file_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(item)}
                        title="Download/View file"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
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
              {editingEvidence ? "Update the evidence details." : "Upload a file and add evidence details."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* File Upload - only show for new evidence */}
            {!editingEvidence && (
              <div className="grid gap-2">
                <Label>File</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.gif,.csv,.xlsx,.xls,.doc,.docx,.txt"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{selectedFile.name}</span>
                      <span className="text-muted-foreground">
                        ({formatFileSize(selectedFile.size)})
                      </span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to select a file or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Images, CSV, Excel, Word (max 50MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.name}
            >
              {isSaving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingEvidence ? "Update" : selectedFile ? "Upload" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
