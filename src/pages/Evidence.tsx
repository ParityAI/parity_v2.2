import { useState, useMemo, useRef } from "react";
import { Upload, Search, FileText, File, Download, Trash2, Info } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface EvidenceFile {
  id: string;
  name: string;
  type: "pdf" | "csv" | "doc" | "xlsx" | "image" | "other";
  projectName: string;
  uploadDate: string;
  uploader: string;
  source: string;
  size: string;
  category: string;
}

const initialFiles: EvidenceFile[] = [
  {
    id: "1",
    name: "accuracy_report_AUTOFILLED.pdf",
    type: "pdf",
    projectName: "HireScore Model",
    uploadDate: "2026-01-17",
    uploader: "John Doe",
    source: "File Manager",
    size: "2.4 MB",
    category: "Model Performance",
  },
  {
    id: "2",
    name: "bias_analysis_AUTOFILLED.csv",
    type: "csv",
    projectName: "CandidateRank",
    uploadDate: "2026-01-17",
    uploader: "Jane Smith",
    source: "File Manager",
    size: "1.2 MB",
    category: "Bias Testing",
  },
  {
    id: "3",
    name: "approval_record_AUTOFILLED.pdf",
    type: "pdf",
    projectName: "N/A",
    uploadDate: "2026-01-17",
    uploader: "Mike Johnson",
    source: "File Manager",
    size: "500 KB",
    category: "Compliance",
  },
  {
    id: "4",
    name: "vendor_security_assessment.pdf",
    type: "pdf",
    projectName: "TalentAI Vendor",
    uploadDate: "2026-01-15",
    uploader: "Sarah Wilson",
    source: "Manual Upload",
    size: "3.1 MB",
    category: "Vendor Assessment",
  },
  {
    id: "5",
    name: "training_completion_records.xlsx",
    type: "xlsx",
    projectName: "N/A",
    uploadDate: "2026-01-14",
    uploader: "John Doe",
    source: "HR System",
    size: "890 KB",
    category: "Training",
  },
];

const fileTypeIcons = {
  pdf: "text-red-500",
  csv: "text-green-500",
  doc: "text-blue-500",
  xlsx: "text-green-600",
  image: "text-purple-500",
  other: "text-gray-500",
};

export default function Evidence() {
  const [files, setFiles] = useState<EvidenceFile[]>(initialFiles);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [uploadForm, setUploadForm] = useState({
    projectName: "",
    category: "",
    source: "Manual Upload",
  });

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch =
        file.name.toLowerCase().includes(search.toLowerCase()) ||
        file.projectName.toLowerCase().includes(search.toLowerCase()) ||
        file.uploader.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || file.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [files, search, categoryFilter]);

  const categories = useMemo(() => {
    return [...new Set(files.map(f => f.category))];
  }, [files]);

  const stats = useMemo(() => ({
    total: files.length,
    pdf: files.filter(f => f.type === "pdf").length,
    csv: files.filter(f => f.type === "csv").length,
    other: files.filter(f => !["pdf", "csv"].includes(f.type)).length,
  }), [files]);

  const handleUpload = () => {
    setUploadForm({
      projectName: "",
      category: "",
      source: "Manual Upload",
    });
    setUploadDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    const fileType = ["pdf"].includes(fileExtension) ? "pdf"
      : ["csv"].includes(fileExtension) ? "csv"
      : ["doc", "docx"].includes(fileExtension) ? "doc"
      : ["xls", "xlsx"].includes(fileExtension) ? "xlsx"
      : ["jpg", "jpeg", "png", "gif"].includes(fileExtension) ? "image"
      : "other";

    const newFile: EvidenceFile = {
      id: Date.now().toString(),
      name: selectedFile.name,
      type: fileType,
      projectName: uploadForm.projectName || "N/A",
      uploadDate: new Date().toISOString().split("T")[0],
      uploader: "Current User",
      source: uploadForm.source,
      size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
      category: uploadForm.category || "Uncategorized",
    };

    setFiles([newFile, ...files]);
    setUploadDialogOpen(false);
    toast({ title: "File uploaded", description: "The evidence file has been uploaded successfully." });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    toast({ title: "File deleted", description: "The evidence file has been removed." });
  };

  const handleDownload = (file: EvidenceFile) => {
    toast({ title: "Download started", description: `Downloading ${file.name}...` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Evidence & Documents</h1>
          <p className="text-muted-foreground">
            This table lists all the files uploaded to the system
          </p>
        </div>
        <Button onClick={handleUpload} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload New File
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Centralized evidence storage speeds up audits</AlertTitle>
        <AlertDescription>
          When auditors request documentation, you need to find it quickly. Storing all AI governance evidence in one place
          (assessments, approvals, test results) makes audit responses faster and reduces stress. Tag files clearly for easy retrieval.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PDF Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pdf}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSV Data Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.csv}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Other Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.other}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Uploader</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <File className={`h-5 w-5 ${fileTypeIcons[file.type]}`} />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">{file.size}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{file.projectName}</TableCell>
                <TableCell>{format(new Date(file.uploadDate), "MMM d, yyyy")}</TableCell>
                <TableCell>{file.uploader}</TableCell>
                <TableCell>
                  <Badge variant="outline">{file.source}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{file.category}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(file.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredFiles.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No files found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Upload New File</DialogTitle>
            <DialogDescription>
              Add evidence documentation to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="projectName">Project Name (Optional)</Label>
              <Input
                id="projectName"
                value={uploadForm.projectName}
                onChange={(e) => setUploadForm({ ...uploadForm, projectName: e.target.value })}
                placeholder="Link to a project"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Model Performance">Model Performance</SelectItem>
                  <SelectItem value="Bias Testing">Bias Testing</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Vendor Assessment">Vendor Assessment</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Audit">Audit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Select File</Label>
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.csv,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
