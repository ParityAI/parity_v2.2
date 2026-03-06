import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  Download,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Demo AI systems
const aiSystems = [
  { id: "benefits", name: "Automated Benefits Eligibility System", riskLevel: "high" },
  { id: "hiring", name: "Resume Screening Assistant", riskLevel: "high" },
  { id: "traffic", name: "Traffic Flow Optimization AI", riskLevel: "limited" },
  { id: "chatbot", name: "Citizen Service Chatbot", riskLevel: "minimal" },
];

// Framework requirements mapped to each system
const frameworkMapping = {
  benefits: {
    "EU AI Act": {
      score: 87,
      requirements: [
        { id: "art9-1", name: "Risk Management System", article: "Art. 9(1)", status: "compliant", details: "Comprehensive risk management documented" },
        { id: "art9-2", name: "Risk Identification", article: "Art. 9(2)", status: "compliant", details: "Risks identified and evaluated" },
        { id: "art9-3", name: "Risk Mitigation", article: "Art. 9(3)", status: "partial", details: "Mitigation measures in place, monitoring ongoing" },
        { id: "art10-1", name: "Data Governance", article: "Art. 10(1)", status: "compliant", details: "Training data governance established" },
        { id: "art10-2", name: "Data Quality", article: "Art. 10(2)", status: "compliant", details: "Data quality measures implemented" },
        { id: "art10-3", name: "Bias Examination", article: "Art. 10(3)", status: "partial", details: "Ongoing monitoring for one category" },
        { id: "art13-1", name: "Transparency", article: "Art. 13(1)", status: "compliant", details: "System transparency documented" },
        { id: "art13-2", name: "Instructions for Use", article: "Art. 13(2)", status: "compliant", details: "User instructions provided" },
        { id: "art14-1", name: "Human Oversight Design", article: "Art. 14(1)", status: "compliant", details: "Human oversight built into design" },
        { id: "art14-2", name: "Human Override", article: "Art. 14(2)", status: "compliant", details: "Human can override decisions" },
      ],
    },
    "NIST AI RMF": {
      score: 91,
      requirements: [
        { id: "gov-1", name: "Governance Structure", category: "GOVERN", status: "compliant", details: "AI governance team established" },
        { id: "gov-2", name: "Risk Tolerance", category: "GOVERN", status: "compliant", details: "Risk tolerance defined" },
        { id: "map-1", name: "Context Mapping", category: "MAP", status: "compliant", details: "Use case context documented" },
        { id: "map-2", name: "Stakeholder Analysis", category: "MAP", status: "compliant", details: "Stakeholders identified" },
        { id: "mea-1", name: "Performance Metrics", category: "MEASURE", status: "compliant", details: "KPIs established and tracked" },
        { id: "mea-2", name: "Bias Testing", category: "MEASURE", status: "partial", details: "Regular testing with one area under review" },
        { id: "man-1", name: "Risk Treatment", category: "MANAGE", status: "compliant", details: "Risk treatment plans active" },
        { id: "man-2", name: "Incident Response", category: "MANAGE", status: "compliant", details: "Incident response procedures in place" },
      ],
    },
    "ISO 42001": {
      score: 84,
      requirements: [
        { id: "4.1", name: "Context of Organization", clause: "4.1", status: "compliant", details: "Organizational context defined" },
        { id: "4.2", name: "Interested Parties", clause: "4.2", status: "compliant", details: "Stakeholder needs documented" },
        { id: "5.1", name: "Leadership Commitment", clause: "5.1", status: "compliant", details: "Management commitment demonstrated" },
        { id: "6.1", name: "Risk & Opportunity Assessment", clause: "6.1", status: "partial", details: "Assessment complete, some gaps identified" },
        { id: "7.1", name: "Resources", clause: "7.1", status: "compliant", details: "Adequate resources allocated" },
        { id: "7.2", name: "Competence", clause: "7.2", status: "compliant", details: "Team competencies verified" },
        { id: "8.1", name: "Operational Planning", clause: "8.1", status: "partial", details: "Planning documented, refinement needed" },
        { id: "9.1", name: "Monitoring & Measurement", clause: "9.1", status: "compliant", details: "KPIs tracked regularly" },
        { id: "10.1", name: "Continual Improvement", clause: "10.1", status: "non-compliant", details: "Improvement process not formalized" },
      ],
    },
    "NYC LL144": {
      score: 96,
      requirements: [
        { id: "ll144-1", name: "Bias Audit Conducted", section: "§20-871(a)", status: "compliant", details: "Annual audit completed" },
        { id: "ll144-2", name: "Audit by Independent Auditor", section: "§20-871(b)", status: "compliant", details: "Third-party auditor engaged" },
        { id: "ll144-3", name: "Summary Published", section: "§20-871(c)", status: "compliant", details: "Summary publicly available" },
        { id: "ll144-4", name: "Candidate Notice", section: "§20-871(d)", status: "compliant", details: "Candidates notified of AEDT use" },
        { id: "ll144-5", name: "Alternative Process", section: "§20-871(e)", status: "compliant", details: "Alternative available upon request" },
      ],
    },
  },
};

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "compliant":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case "partial":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "non-compliant":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    compliant: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", label: "Compliant" },
    partial: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "Partial" },
    "non-compliant": { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Non-Compliant" },
  };
  const { color, label } = config[status as keyof typeof config] || config.partial;
  return <Badge variant="outline" className={color}>{label}</Badge>;
}

function FrameworkSection({
  framework,
  data
}: {
  framework: string;
  data: { score: number; requirements: Array<{ id: string; name: string; status: string; details: string; article?: string; category?: string; clause?: string; section?: string }> };
}) {
  const [isOpen, setIsOpen] = useState(true);

  const compliant = data.requirements.filter(r => r.status === "compliant").length;
  const partial = data.requirements.filter(r => r.status === "partial").length;
  const nonCompliant = data.requirements.filter(r => r.status === "non-compliant").length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:bg-card">
          <div className="flex items-center gap-4">
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <h3 className="font-medium text-foreground">{framework}</h3>
              <p className="text-sm text-muted-foreground">
                {data.requirements.length} requirements • {compliant} compliant, {partial} partial, {nonCompliant} non-compliant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-semibold text-foreground">{data.score}%</p>
              <p className="text-xs text-muted-foreground">Compliance Score</p>
            </div>
            <div className="h-12 w-12">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="hsl(160 84% 54%)"
                  strokeWidth="3"
                  strokeDasharray={`${data.score} 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 space-y-2 pl-9">
          {data.requirements.map((req) => (
            <motion.div
              key={req.id}
              className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/20 px-4 py-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <StatusIcon status={req.status} />
                <div>
                  <p className="text-sm font-medium text-foreground">{req.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.article || req.category || req.clause || req.section} • {req.details}
                  </p>
                </div>
              </div>
              <StatusBadge status={req.status} />
            </motion.div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function FrameworkComparison() {
  const [selectedSystem, setSelectedSystem] = useState("benefits");
  const systemData = frameworkMapping[selectedSystem as keyof typeof frameworkMapping];
  const selectedSystemInfo = aiSystems.find(s => s.id === selectedSystem);

  // Calculate overall stats
  const frameworks = Object.keys(systemData);
  const avgScore = Math.round(
    Object.values(systemData).reduce((acc, f) => acc + f.score, 0) / frameworks.length
  );
  const totalRequirements = Object.values(systemData).reduce(
    (acc, f) => acc + f.requirements.length,
    0
  );
  const totalCompliant = Object.values(systemData).reduce(
    (acc, f) => acc + f.requirements.filter(r => r.status === "compliant").length,
    0
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Comparative Framework View</h1>
                <p className="text-sm text-muted-foreground">
                  See how your AI system maps to multiple compliance frameworks
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* System Selector */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Select AI System
              </label>
              <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiSystems.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                      <div className="flex items-center gap-2">
                        <span>{system.name}</span>
                        <Badge
                          variant="outline"
                          className={
                            system.riskLevel === "high"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : system.riskLevel === "limited"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }
                        >
                          {system.riskLevel}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Overview Stats */}
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <p className="text-sm text-muted-foreground">Frameworks Evaluated</p>
                <p className="text-3xl font-semibold text-foreground">{frameworks.length}</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <p className="text-sm text-muted-foreground">Average Compliance</p>
                <p className="text-3xl font-semibold text-primary">{avgScore}%</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <p className="text-sm text-muted-foreground">Total Requirements</p>
                <p className="text-3xl font-semibold text-foreground">{totalRequirements}</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-4">
                <p className="text-sm text-muted-foreground">Compliant Items</p>
                <p className="text-3xl font-semibold text-emerald-500">{totalCompliant}</p>
              </div>
            </div>

            {/* Comparison Matrix Header */}
            <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-medium text-foreground">{selectedSystemInfo?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Compliance status across {frameworks.length} regulatory frameworks
                  </p>
                </div>
              </div>
            </div>

            {/* Framework Sections */}
            <div className="space-y-4">
              {Object.entries(systemData).map(([framework, data]) => (
                <FrameworkSection key={framework} framework={framework} data={data} />
              ))}
            </div>

            {/* Gap Analysis Summary */}
            <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-medium text-foreground">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Gap Analysis Summary
              </h3>
              <div className="space-y-3">
                {Object.entries(systemData).flatMap(([framework, data]) =>
                  data.requirements
                    .filter(r => r.status !== "compliant")
                    .map(req => (
                      <div
                        key={`${framework}-${req.id}`}
                        className="flex items-center justify-between rounded-lg bg-background/50 px-4 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon status={req.status} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{req.name}</p>
                            <p className="text-xs text-muted-foreground">{framework}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{req.details}</p>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
