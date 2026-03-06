import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Shield,
  AlertTriangle,
  Users,
  Database,
  Scale,
  FileText,
  Clock,
  Building2,
  Eye,
  Code,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Sample system for preview
const sampleSystem = {
  name: "Automated Benefits Eligibility System",
  version: "2.1.0",
  department: "Department of Social Services",
  riskLevel: "high",
  purpose: "Determines initial eligibility for social benefits based on application data",
  intendedUse: "Pre-screening of benefit applications to expedite processing",
  outOfScope: "Final eligibility decisions, appeals processing, fraud detection",
  dataInputs: ["Income records", "Employment status", "Family composition", "Residence history"],
  dataOutput: "Eligibility recommendation (Likely Eligible, Needs Review, Likely Ineligible)",
  modelType: "Gradient Boosted Decision Tree",
  trainingData: "Historical applications from 2018-2023 (anonymized)",
  humanOversight: "All decisions reviewed by caseworker within 48 hours",
  appealProcess: "Citizens may request human review via form DSS-AI-01",
  biasEvaluations: [
    { category: "Gender", result: "Pass", date: "2025-11-15" },
    { category: "Age", result: "Pass", date: "2025-11-15" },
    { category: "Ethnicity", result: "Monitoring", date: "2025-11-15" },
    { category: "Disability Status", result: "Pass", date: "2025-11-15" },
  ],
  limitations: [
    "Cannot process applications with missing income data",
    "May underperform for self-employed applicants",
    "Requires manual review for complex family structures",
  ],
  ethicalConsiderations: [
    "System may perpetuate historical biases in benefit allocation",
    "Automated decisions affect vulnerable populations",
    "Transparency in decision factors is limited by model complexity",
  ],
  complianceFrameworks: ["EU AI Act", "NYC LL144", "NIST AI RMF"],
  lastUpdated: "2025-12-01",
  contactEmail: "ai-governance@socialservices.gov",
};

function SystemCardPreview({ data }: { data: typeof sampleSystem }) {
  const riskColors = {
    high: "border-red-500 bg-red-500/10",
    limited: "border-amber-500 bg-amber-500/10",
    minimal: "border-emerald-500 bg-emerald-500/10",
  };

  return (
    <div className="rounded-2xl border-2 border-border bg-card p-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <img src="/logo-icon.svg" alt="Parity AI" className="h-6 w-6" />
              <span className="text-xs font-medium text-muted-foreground">AI SYSTEM CARD</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">{data.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.department} • Version {data.version}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`${riskColors[data.riskLevel as keyof typeof riskColors]} px-3 py-1 text-sm font-medium capitalize`}
          >
            {data.riskLevel} Risk
          </Badge>
        </div>
      </div>

      {/* Purpose & Use */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Eye className="h-4 w-4 text-primary" />
          Purpose
        </h3>
        <p className="text-sm text-muted-foreground">{data.purpose}</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Intended Use</h3>
          <p className="text-sm text-muted-foreground">{data.intendedUse}</p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Out of Scope</h3>
          <p className="text-sm text-muted-foreground">{data.outOfScope}</p>
        </div>
      </div>

      {/* Data */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Database className="h-4 w-4 text-primary" />
          Data Inputs
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.dataInputs.map((input) => (
            <Badge key={input} variant="secondary" className="text-xs">
              {input}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Output</h3>
        <p className="text-sm text-muted-foreground">{data.dataOutput}</p>
      </div>

      {/* Human Oversight */}
      <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="h-4 w-4 text-primary" />
          Human Oversight
        </h3>
        <p className="text-sm text-muted-foreground">{data.humanOversight}</p>
      </div>

      {/* Appeal Process */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Scale className="h-4 w-4 text-primary" />
          Appeal Process
        </h3>
        <p className="text-sm text-muted-foreground">{data.appealProcess}</p>
      </div>

      {/* Bias Evaluations */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Shield className="h-4 w-4 text-primary" />
          Bias Evaluations
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {data.biasEvaluations.map((eval_) => (
            <div
              key={eval_.category}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-3 py-2"
            >
              <span className="text-xs text-muted-foreground">{eval_.category}</span>
              <Badge
                variant="outline"
                className={
                  eval_.result === "Pass"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }
              >
                {eval_.result}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Known Limitations
        </h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {data.limitations.map((limitation, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground" />
              {limitation}
            </li>
          ))}
        </ul>
      </div>

      {/* Ethical Considerations */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Ethical Considerations</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {data.ethicalConsiderations.map((consideration, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground" />
              {consideration}
            </li>
          ))}
        </ul>
      </div>

      {/* Compliance */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          Compliance Frameworks
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.complianceFrameworks.map((framework) => (
            <Badge key={framework} variant="outline" className="text-xs">
              {framework}
            </Badge>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
        <span>Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}</span>
        <span>Contact: {data.contactEmail}</span>
      </div>
    </div>
  );
}

export default function SystemCardGenerator() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState(sampleSystem);

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed/system-card/${formData.name.toLowerCase().replace(/\s+/g, '-')}" width="100%" height="800" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: string) => {
    // In a real implementation, this would generate the actual file
    console.log(`Downloading as ${format}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">
              <div>
                <h1 className="text-xl font-semibold text-foreground">AI System Card Generator</h1>
                <p className="text-sm text-muted-foreground">
                  Create shareable, embeddable cards for your AI deployments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => handleDownload("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button onClick={handleCopyEmbed}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Code className="mr-2 h-4 w-4" />
                      Copy Embed Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Form */}
              <div>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="mb-6 w-full">
                    <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
                    <TabsTrigger value="data" className="flex-1">Data & Model</TabsTrigger>
                    <TabsTrigger value="oversight" className="flex-1">Oversight</TabsTrigger>
                    <TabsTrigger value="evaluation" className="flex-1">Evaluation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label>System Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Version</Label>
                        <Input
                          value={formData.version}
                          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Risk Level</Label>
                        <Select
                          value={formData.riskLevel}
                          onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High Risk</SelectItem>
                            <SelectItem value="limited">Limited Risk</SelectItem>
                            <SelectItem value="minimal">Minimal Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Purpose</Label>
                      <Textarea
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Intended Use</Label>
                      <Textarea
                        value={formData.intendedUse}
                        onChange={(e) => setFormData({ ...formData, intendedUse: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Out of Scope Uses</Label>
                      <Textarea
                        value={formData.outOfScope}
                        onChange={(e) => setFormData({ ...formData, outOfScope: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="data" className="space-y-4">
                    <div>
                      <Label>Data Inputs (comma separated)</Label>
                      <Textarea
                        value={formData.dataInputs.join(", ")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dataInputs: e.target.value.split(",").map((s) => s.trim()),
                          })
                        }
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Output Description</Label>
                      <Textarea
                        value={formData.dataOutput}
                        onChange={(e) => setFormData({ ...formData, dataOutput: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Model Type</Label>
                      <Input
                        value={formData.modelType}
                        onChange={(e) => setFormData({ ...formData, modelType: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Training Data Description</Label>
                      <Textarea
                        value={formData.trainingData}
                        onChange={(e) => setFormData({ ...formData, trainingData: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="oversight" className="space-y-4">
                    <div>
                      <Label>Human Oversight Process</Label>
                      <Textarea
                        value={formData.humanOversight}
                        onChange={(e) => setFormData({ ...formData, humanOversight: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Appeal Process</Label>
                      <Textarea
                        value={formData.appealProcess}
                        onChange={(e) => setFormData({ ...formData, appealProcess: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Contact Email</Label>
                      <Input
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="evaluation" className="space-y-4">
                    <div>
                      <Label>Known Limitations (one per line)</Label>
                      <Textarea
                        value={formData.limitations.join("\n")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            limitations: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Ethical Considerations (one per line)</Label>
                      <Textarea
                        value={formData.ethicalConsiderations.join("\n")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ethicalConsiderations: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Compliance Frameworks (comma separated)</Label>
                      <Input
                        value={formData.complianceFrameworks.join(", ")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            complianceFrameworks: e.target.value.split(",").map((s) => s.trim()),
                          })
                        }
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Preview */}
              <div>
                <div className="sticky top-24">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">Live Preview</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload("png")}>
                        <Image className="mr-2 h-3 w-3" />
                        PNG
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload("json")}>
                        <Code className="mr-2 h-3 w-3" />
                        JSON
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-xl border border-border/50 bg-secondary/20 p-4">
                    <SystemCardPreview data={formData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
