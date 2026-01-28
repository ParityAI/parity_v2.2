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
import { useCreateVendor, VendorInsert } from "@/hooks/useVendors";
import { useToast } from "@/hooks/use-toast";

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CSVRow {
  name: string;
  description?: string;
  contact_email?: string;
  website?: string;
  risk_score?: string;
}

export function CSVUploadDialog({ open, onOpenChange }: CSVUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createVendor = useCreateVendor();
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
          const rowNum = index + 2;

          if (!row.name || row.name.trim() === "") {
            validationErrors.push(`Row ${rowNum}: Name is required`);
            return;
          }

          if (row.contact_email && !row.contact_email.includes("@")) {
            validationErrors.push(`Row ${rowNum}: Invalid email format`);
            return;
          }

          if (row.risk_score) {
            const score = parseInt(row.risk_score);
            if (isNaN(score) || score < 0 || score > 100) {
              validationErrors.push(`Row ${rowNum}: Risk score must be between 0 and 100`);
              return;
            }
          }

          validRows.push({
            name: row.name.trim(),
            description: row.description?.trim() || undefined,
            contact_email: row.contact_email?.trim() || undefined,
            website: row.website?.trim() || undefined,
            risk_score: row.risk_score?.trim() || undefined,
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
        const vendorData: Omit<VendorInsert, "id" | "created_at" | "updated_at" | "organization_id"> = {
          name: row.name,
          description: row.description || null,
          contact_email: row.contact_email || null,
          website: row.website || null,
          risk_score: row.risk_score ? parseInt(row.risk_score) : null,
          security_assessment: false,
        };

        await createVendor.mutateAsync(vendorData);
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
      description: `Successfully imported ${successCount} vendors. ${failCount > 0 ? `${failCount} failed.` : ""}`,
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
    const template = "name,description,contact_email,website,risk_score\nExample Vendor,AI solutions provider,contact@example.com,https://example.com,50\n";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendors-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Vendors from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import vendors. Download the template for the correct format.
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
              {isUploading ? "Importing..." : `Import ${parsedData.length} Vendors`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
