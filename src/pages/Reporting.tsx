import { useState } from "react";
import { FileDown, Search, FileText, Calendar, BarChart3, Info, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { generateModelsReport } from "@/lib/generateModelsReport";
import { generateVendorsReport } from "@/lib/generateVendorsReport";
import { useModels } from "@/hooks/useModels";
import { useVendors } from "@/hooks/useVendors";

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  project: string;
  dateGenerated: string;
  generatedBy: string;
}

const reportTemplates = [
  {
    id: "1",
    name: "Model Inventory Report",
    description: "Complete inventory of all AI models with risk levels and status",
    icon: BarChart3,
    type: "models",
  },
  {
    id: "2",
    name: "Vendor Risk Assessment",
    description: "Third-party vendor risk scores and security assessments",
    icon: FileText,
    type: "vendors",
  },
  {
    id: "3",
    name: "Compliance Status Report",
    description: "Framework compliance status across all regulations",
    icon: FileText,
    type: "compliance",
  },
  {
    id: "4",
    name: "Incident Summary Report",
    description: "Overview of all incidents by severity and status",
    icon: FileText,
    type: "incidents",
  },
  {
    id: "5",
    name: "Risk Management Report",
    description: "Comprehensive risk register with mitigation status",
    icon: FileText,
    type: "risks",
  },
  {
    id: "6",
    name: "Executive Dashboard Report",
    description: "High-level KPIs and metrics for leadership",
    icon: BarChart3,
    type: "executive",
  },
];

export default function Reporting() {
  const [search, setSearch] = useState("");
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const { toast } = useToast();
  const { data: models } = useModels();
  const { data: vendors } = useVendors();

  const handleGenerateReport = (template: typeof reportTemplates[0]) => {
    if (template.type === "models" && models) {
      generateModelsReport({ models });
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: template.name,
        type: template.type,
        project: "Organization",
        dateGenerated: new Date().toISOString(),
        generatedBy: "Current User",
      };
      setGeneratedReports([newReport, ...generatedReports]);
      toast({ title: "Report generated", description: `${template.name} has been downloaded.` });
    } else if (template.type === "vendors" && vendors) {
      generateVendorsReport({ vendors });
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: template.name,
        type: template.type,
        project: "Organization",
        dateGenerated: new Date().toISOString(),
        generatedBy: "Current User",
      };
      setGeneratedReports([newReport, ...generatedReports]);
      toast({ title: "Report generated", description: `${template.name} has been downloaded.` });
    } else {
      toast({
        title: "Report template",
        description: `${template.name} generation will be available soon.`,
      });
    }
  };

  const filteredTemplates = reportTemplates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase()) ||
    template.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reporting</h1>
          <p className="text-muted-foreground">
            Want a report? We'll create one using the info from your Compliance, Assessment, and Vendor/Risk sections.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              Generate Report
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {reportTemplates.map((template) => (
              <DropdownMenuItem key={template.id} onClick={() => handleGenerateReport(template)}>
                {template.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Reports communicate AI governance status to stakeholders</AlertTitle>
        <AlertDescription>
          Executives, boards, and regulators need regular updates on AI governance activities.
          Pre-built reports summarize key metrics, risks, and compliance status.
          Schedule regular reporting to keep stakeholders informed and engaged.
        </AlertDescription>
      </Alert>

      {/* Report Templates */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Report Templates</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleGenerateReport(template)}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <template.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <FileDown className="h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Generated Reports History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recently Generated Reports</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type of Report</TableHead>
                <TableHead>Project/Organization</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.type}</Badge>
                  </TableCell>
                  <TableCell>{report.project}</TableCell>
                  <TableCell>{format(new Date(report.dateGenerated), "MMM d, yyyy HH:mm")}</TableCell>
                  <TableCell>{report.generatedBy}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {generatedReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="h-12 w-12 opacity-50" />
                      <p>There is currently no data in this table.</p>
                      <p className="text-sm">Generate a report using the templates above.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
