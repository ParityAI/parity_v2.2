import { useState } from "react";
import { FileDown, Search, FileText, Calendar, BarChart3, Info, ChevronDown, Loader2 } from "lucide-react";
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
import { generateComplianceReport } from "@/lib/generateComplianceReport";
import { generateIncidentsReport } from "@/lib/generateIncidentsReport";
import { generateRisksReport } from "@/lib/generateRisksReport";
import { generateExecutiveReport } from "@/lib/generateExecutiveReport";
import { useModels } from "@/hooks/useModels";
import { useVendors } from "@/hooks/useVendors";
import { useIncidents } from "@/hooks/useIncidents";
import { useRisks } from "@/hooks/useRisks";
import { useCompliance } from "@/hooks/useCompliance";

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
  const [generating, setGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: models = [] } = useModels();
  const { data: vendors = [] } = useVendors();
  const { data: incidents = [] } = useIncidents();
  const { data: risks = [] } = useRisks();
  const { frameworks = [], assessments = [], checklists = [] } = useCompliance();

  const addToHistory = (template: typeof reportTemplates[0]) => {
    const newReport: GeneratedReport = {
      id: Date.now().toString(),
      name: template.name,
      type: template.type,
      project: "Organization",
      dateGenerated: new Date().toISOString(),
      generatedBy: "Current User",
    };
    setGeneratedReports([newReport, ...generatedReports]);
  };

  const handleGenerateReport = async (template: typeof reportTemplates[0]) => {
    setGenerating(template.type);

    try {
      // Small delay for UX feedback
      await new Promise(resolve => setTimeout(resolve, 300));

      switch (template.type) {
        case "models":
          if (models.length > 0) {
            generateModelsReport({ models });
            addToHistory(template);
            toast({ title: "Report generated", description: `${template.name} has been downloaded.` });
          } else {
            toast({ title: "No data", description: "No models found to generate report.", variant: "destructive" });
          }
          break;

        case "vendors":
          if (vendors.length > 0) {
            generateVendorsReport({ vendors });
            addToHistory(template);
            toast({ title: "Report generated", description: `${template.name} has been downloaded.` });
          } else {
            toast({ title: "No data", description: "No vendors found to generate report.", variant: "destructive" });
          }
          break;

        case "compliance":
          if (frameworks.length > 0) {
            generateComplianceReport({ frameworks, assessments, checklists });
            addToHistory(template);
            toast({ title: "Report generated", description: `${template.name} has been downloaded.` });
          } else {
            toast({ title: "No data", description: "No compliance frameworks found to generate report.", variant: "destructive" });
          }
          break;

        case "incidents":
          if (incidents.length > 0) {
            generateIncidentsReport({ incidents });
            addToHistory(template);
            toast({ title: "Report generated", description: `${template.name} has been downloaded.` });
          } else {
            toast({ title: "No data", description: "No incidents found to generate report.", variant: "destructive" });
          }
          break;

        case "risks":
          if (risks.length > 0) {
            generateRisksReport({ risks });
            addToHistory(template);
            toast({ title: "Report generated", description: `${template.name} has been downloaded.` });
          } else {
            toast({ title: "No data", description: "No risks found to generate report.", variant: "destructive" });
          }
          break;

        case "executive":
          // Executive report always works - shows zeros if no data
          generateExecutiveReport({
            models: {
              total: models.length,
              approved: models.filter(m => m.status === "approved").length,
              pending: models.filter(m => m.status === "pending").length,
              highRisk: models.filter(m => m.risk_level === "high").length,
            },
            vendors: {
              total: vendors.length,
              assessed: vendors.filter(v => v.security_assessment).length,
              highRisk: vendors.filter(v => v.risk_score !== null && v.risk_score >= 70).length,
              avgRiskScore: Math.round(
                vendors.filter(v => v.risk_score !== null).reduce((sum, v) => sum + (v.risk_score || 0), 0) /
                (vendors.filter(v => v.risk_score !== null).length || 1)
              ),
            },
            incidents: {
              total: incidents.length,
              open: incidents.filter(i => i.status === "open" || i.status === "investigating").length,
              critical: incidents.filter(i => i.severity === "critical").length,
              closedThisMonth: incidents.filter(i => {
                if (i.status !== "closed") return false;
                const updated = new Date(i.updated_at);
                const now = new Date();
                return updated.getMonth() === now.getMonth() && updated.getFullYear() === now.getFullYear();
              }).length,
            },
            compliance: {
              total: assessments.length,
              compliant: assessments.filter(a => a.status === "passed" || a.status === "compliant").length,
              overdue: assessments.filter(a => {
                if (!a.deadline || a.status === "passed") return false;
                return new Date(a.deadline) < new Date();
              }).length,
              avgScore: Math.round(
                assessments.filter(a => a.score !== null).reduce((sum, a) => sum + (a.score || 0), 0) /
                (assessments.filter(a => a.score !== null).length || 1)
              ),
            },
            risks: {
              total: risks.length,
              critical: risks.filter(r => r.severity === "critical").length,
              mitigated: risks.filter(r => r.mitigation_status === "completed" || r.mitigation_status === "accepted").length,
              inProgress: risks.filter(r => r.mitigation_status === "in_progress").length,
            },
          });
          addToHistory(template);
          toast({ title: "Report generated", description: `${template.name} has been downloaded.` });
          break;

        default:
          toast({
            title: "Report template",
            description: `${template.name} generation is not yet implemented.`,
          });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(null);
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
            Generate comprehensive reports from your Compliance, Assessment, and Vendor/Risk data.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2" disabled={generating !== null}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Report
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
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
          Pre-built reports summarize key metrics, risks, and compliance status in PDF format.
        </AlertDescription>
      </Alert>

      {/* Report Templates */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Report Templates</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleGenerateReport(template)}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <template.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  disabled={generating === template.type}
                >
                  {generating === template.type ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4" />
                      Generate
                    </>
                  )}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const template = reportTemplates.find(t => t.type === report.type);
                        if (template) handleGenerateReport(template);
                      }}
                    >
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
                      <p>No reports generated yet.</p>
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
