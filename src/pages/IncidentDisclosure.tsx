import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Download,
  Copy,
  Check,
  FileText,
  Users,
  Clock,
  Shield,
  ChevronRight,
  Eye,
  Printer,
  Mail,
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
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Sample incident for demonstration
const sampleIncident = {
  id: "INC-2025-0042",
  title: "Benefits Eligibility Calculation Error",
  system: "Automated Benefits Eligibility System",
  department: "Department of Social Services",
  severity: "medium",
  dateDiscovered: "2025-11-28",
  dateResolved: "2025-12-02",
  affectedCitizens: 847,
  summary: "A software error in the benefits eligibility calculation system caused incorrect eligibility determinations for a subset of applications submitted between November 15-28, 2025.",
  whatHappened: "The system's income threshold calculation module was incorrectly applying a 2024 poverty guideline instead of the updated 2025 guideline, resulting in some applicants being incorrectly determined as ineligible.",
  impact: "847 benefit applications were affected. Of these, 312 applicants were incorrectly marked as ineligible and 535 received delayed processing.",
  rootCause: "During a routine system update on November 14, 2025, the configuration file containing poverty guidelines was not properly updated. The error was not caught by automated testing because the test dataset used 2024 dates.",
  remediation: [
    "All 847 affected applications have been re-processed with correct guidelines",
    "312 incorrectly denied applicants have been notified and approved where eligible",
    "Affected citizens received expedited processing with average 2-day turnaround",
    "Back-payments issued for any benefits delayed due to this error",
  ],
  preventionMeasures: [
    "Implemented automated validation of poverty guideline dates against current year",
    "Added integration test suite specifically for annual policy updates",
    "Created checklist for configuration updates requiring sign-off from two team members",
    "Established monthly audit of critical configuration parameters",
  ],
  contactInfo: {
    office: "Department of Social Services - AI Governance Office",
    email: "ai-incidents@socialservices.gov",
    phone: "(555) 123-4567",
    appealForm: "DSS-AI-APPEAL-01",
  },
};

function DisclosurePreview({ data }: { data: typeof sampleIncident }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-8 text-foreground">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-2 text-primary">
          <img src="/logo-icon.svg" alt="Parity AI" className="h-6 w-6" />
          <span className="text-sm font-medium">PUBLIC INCIDENT DISCLOSURE</span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold">{data.title}</h2>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span>Incident ID: {data.id}</span>
          <span>•</span>
          <span>Published: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border/50 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">AI System</p>
          <p className="text-sm font-medium">{data.system}</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Department</p>
          <p className="text-sm font-medium">{data.department}</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Citizens Affected</p>
          <p className="text-sm font-medium">{data.affectedCitizens.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Status</p>
          <Badge variant="outline" className="mt-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Resolved
          </Badge>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-primary" />
          Summary
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
      </div>

      {/* What Happened */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          What Happened
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.whatHappened}</p>
      </div>

      {/* Impact */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4 text-primary" />
          Impact on Citizens
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.impact}</p>
      </div>

      {/* Root Cause */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold">Root Cause Analysis</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.rootCause}</p>
      </div>

      {/* Remediation */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Check className="h-4 w-4 text-emerald-500" />
          Actions Taken
        </h3>
        <ul className="space-y-2">
          {data.remediation.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Prevention */}
      <div className="mb-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Shield className="h-4 w-4 text-primary" />
          Prevention Measures
        </h3>
        <ul className="space-y-2">
          {data.preventionMeasures.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Clock className="h-4 w-4 text-primary" />
          Timeline
        </h3>
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-border/50 bg-secondary/30 px-4 py-2">
            <p className="text-xs text-muted-foreground">Discovered</p>
            <p className="text-sm font-medium">{new Date(data.dateDiscovered).toLocaleDateString()}</p>
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
            <p className="text-xs text-muted-foreground">Resolved</p>
            <p className="text-sm font-medium">{new Date(data.dateResolved).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <h3 className="mb-3 text-sm font-semibold">Questions or Concerns?</h3>
        <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          <p><strong>Office:</strong> {data.contactInfo.office}</p>
          <p><strong>Email:</strong> {data.contactInfo.email}</p>
          <p><strong>Phone:</strong> {data.contactInfo.phone}</p>
          <p><strong>Appeal Form:</strong> {data.contactInfo.appealForm}</p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          If you believe you were affected by this incident and have not been contacted,
          please reach out using the contact information above.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <p>This disclosure is part of our commitment to AI transparency and democratic accountability.</p>
        <p className="mt-1">Document generated via Parity AI Governance Platform</p>
      </div>
    </div>
  );
}

export default function IncidentDisclosure() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState(sampleIncident);

  const handleCopy = () => {
    // In real implementation, this would copy the formatted text
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                <h1 className="text-xl font-semibold text-foreground">Incident Public Disclosure</h1>
                <p className="text-sm text-muted-foreground">
                  Generate citizen-facing incident disclosure templates
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Email to Affected
                </Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Form */}
              <div>
                <Tabs defaultValue="incident" className="w-full">
                  <TabsList className="mb-6 w-full">
                    <TabsTrigger value="incident" className="flex-1">Incident Details</TabsTrigger>
                    <TabsTrigger value="impact" className="flex-1">Impact & Response</TabsTrigger>
                    <TabsTrigger value="contact" className="flex-1">Contact Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="incident" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Incident ID</Label>
                        <Input
                          value={formData.id}
                          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Severity</Label>
                        <Select
                          value={formData.severity}
                          onValueChange={(value) => setFormData({ ...formData, severity: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Incident Title</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>AI System</Label>
                      <Input
                        value={formData.system}
                        onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Summary (for citizens)</Label>
                      <Textarea
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>What Happened</Label>
                      <Textarea
                        value={formData.whatHappened}
                        onChange={(e) => setFormData({ ...formData, whatHappened: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Root Cause</Label>
                      <Textarea
                        value={formData.rootCause}
                        onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="impact" className="space-y-4">
                    <div>
                      <Label>Number of Citizens Affected</Label>
                      <Input
                        type="number"
                        value={formData.affectedCitizens}
                        onChange={(e) =>
                          setFormData({ ...formData, affectedCitizens: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label>Impact Description</Label>
                      <Textarea
                        value={formData.impact}
                        onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date Discovered</Label>
                        <Input
                          type="date"
                          value={formData.dateDiscovered}
                          onChange={(e) => setFormData({ ...formData, dateDiscovered: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Date Resolved</Label>
                        <Input
                          type="date"
                          value={formData.dateResolved}
                          onChange={(e) => setFormData({ ...formData, dateResolved: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Remediation Actions (one per line)</Label>
                      <Textarea
                        value={formData.remediation.join("\n")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            remediation: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Prevention Measures (one per line)</Label>
                      <Textarea
                        value={formData.preventionMeasures.join("\n")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preventionMeasures: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div>
                      <Label>Office Name</Label>
                      <Input
                        value={formData.contactInfo.office}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, office: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={formData.contactInfo.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, email: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.contactInfo.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, phone: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Appeal Form ID</Label>
                      <Input
                        value={formData.contactInfo.appealForm}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, appealForm: e.target.value },
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
                    <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Eye className="h-4 w-4" />
                      Live Preview
                    </h3>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <Check className="mr-2 h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-3 w-3" />
                          Copy Text
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-xl border border-border/50 bg-secondary/20 p-4">
                    <DisclosurePreview data={formData} />
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
