import { useState, useRef } from "react";
import Papa from "papaparse";
import { Upload, FileText, AlertCircle, CheckCircle, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateModel, ModelInsert } from "@/hooks/useModels";
import { useToast } from "@/hooks/use-toast";

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CSVRow {
  name: string;
  provider?: string;
  version?: string;
  description?: string;
  status?: string;
  risk_level?: string;
}

const VALID_STATUSES = ["approved", "restricted", "pending", "blocked"];
const VALID_RISK_LEVELS = ["high", "medium", "low"];

export function CSVUploadDialog({ open, onOpenChange }: CSVUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createModel = useCreateModel();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setErrors(["Please select a CSV file"]);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setParsedData([]);
    setUploadComplete(false);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validationErrors: string[] = [];
        const validRows: CSVRow[] = [];

        results.data.forEach((row: any, index: number) => {
          const rowNum = index + 2; // Account for header row

          if (!row.name || row.name.trim() === "") {
            validationErrors.push(`Row ${rowNum}: Name is required`);
            return;
          }

          if (row.status && !VALID_STATUSES.includes(row.status.toLowerCase())) {
            validationErrors.push(`Row ${rowNum}: Invalid status "${row.status}". Must be one of: ${VALID_STATUSES.join(", ")}`);
            return;
          }

          if (row.risk_level && !VALID_RISK_LEVELS.includes(row.risk_level.toLowerCase())) {
            validationErrors.push(`Row ${rowNum}: Invalid risk_level "${row.risk_level}". Must be one of: ${VALID_RISK_LEVELS.join(", ")}`);
            return;
          }

          validRows.push({
            name: row.name.trim(),
            provider: row.provider?.trim() || undefined,
            version: row.version?.trim() || undefined,
            description: row.description?.trim() || undefined,
            status: row.status?.toLowerCase() || "pending",
            risk_level: row.risk_level?.toLowerCase() || "medium",
          });
        });

        setParsedData(validRows);
        setErrors(validationErrors);
      },
      error: (error) => {
        setErrors([`Failed to parse CSV: ${error.message}`]);
      },
    });
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];

      try {
        const modelData: ModelInsert = {
          name: row.name,
          provider: row.provider || null,
          version: row.version || null,
          description: row.description || null,
          status: (row.status as "approved" | "restricted" | "pending" | "blocked") || "pending",
          risk_level: (row.risk_level as "high" | "medium" | "low") || "medium",
          security_assessment: false,
          vendor_id: null,
        };

        await createModel.mutateAsync(modelData);
        successCount++;
      } catch {
        failCount++;
      }

      setProgress(Math.round(((i + 1) / parsedData.length) * 100));
    }

    setIsUploading(false);
    setUploadComplete(true);

    toast({
      title: "Import Complete",
      description: `Successfully imported ${successCount} models. ${failCount > 0 ? `${failCount} failed.` : ""}`,
      variant: failCount > 0 ? "destructive" : "default",
    });
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setProgress(0);
    setUploadComplete(false);
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const template = "name,provider,version,description,status,risk_level\nExample Model,OpenAI,v1.0,An example AI model,pending,medium\n";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "models-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Models from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import models. Download the template for the correct format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>

          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {parsedData.length} valid rows found
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to select a CSV file or drag and drop
                </p>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                  {errors.slice(0, 5).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li>...and {errors.length - 5} more errors</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Importing... {progress}%
              </p>
            </div>
          )}

          {uploadComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Import completed successfully!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {uploadComplete ? "Close" : "Cancel"}
          </Button>
          {!uploadComplete && (
            <Button
              onClick={handleUpload}
              disabled={parsedData.length === 0 || isUploading || errors.length > 0}
            >
              {isUploading ? "Importing..." : `Import ${parsedData.length} Models`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
