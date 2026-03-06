import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Users,
  Scale,
  FileText,
  ChevronDown,
  Eye,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

// Demo data for public AI registry
const publicAISystems = [
  {
    id: "ai-001",
    name: "Automated Benefits Eligibility System",
    department: "Department of Social Services",
    riskLevel: "high",
    status: "active",
    purpose: "Determines initial eligibility for social benefits based on application data",
    dataUsed: ["Income records", "Employment status", "Family composition", "Residence history"],
    humanOversight: "All decisions reviewed by caseworker within 48 hours",
    appealProcess: "Citizens may request human review via form DSS-AI-01",
    deploymentDate: "2024-03-15",
    lastAudit: "2025-12-01",
    complianceScore: 94,
    vendor: "GovTech Solutions Inc.",
    biasTestResults: {
      gender: "Pass",
      age: "Pass",
      ethnicity: "Monitoring",
      disability: "Pass",
    },
    incidents: 2,
    documentsPublic: 12,
  },
  {
    id: "ai-002",
    name: "Traffic Flow Optimization AI",
    department: "Department of Transportation",
    riskLevel: "limited",
    status: "active",
    purpose: "Optimizes traffic signal timing based on real-time traffic patterns",
    dataUsed: ["Traffic camera feeds", "Vehicle counts", "Time of day patterns"],
    humanOversight: "Traffic control center monitors 24/7",
    appealProcess: "N/A - No individual decisions",
    deploymentDate: "2023-08-20",
    lastAudit: "2025-10-15",
    complianceScore: 98,
    vendor: "SmartCity AI",
    biasTestResults: null,
    incidents: 0,
    documentsPublic: 8,
  },
  {
    id: "ai-003",
    name: "Resume Screening Assistant",
    department: "Human Resources",
    riskLevel: "high",
    status: "active",
    purpose: "Pre-screens job applications for minimum qualifications",
    dataUsed: ["Resume content", "Job requirements", "Qualification keywords"],
    humanOversight: "HR specialist reviews all shortlisted and rejected candidates",
    appealProcess: "Applicants may request full human review within 14 days",
    deploymentDate: "2024-06-01",
    lastAudit: "2025-11-20",
    complianceScore: 91,
    vendor: "FairHire Technologies",
    biasTestResults: {
      gender: "Pass",
      age: "Monitoring",
      ethnicity: "Pass",
      disability: "Pass",
    },
    incidents: 1,
    documentsPublic: 15,
  },
  {
    id: "ai-004",
    name: "Fraud Detection System",
    department: "Revenue & Taxation",
    riskLevel: "high",
    status: "active",
    purpose: "Identifies potentially fraudulent tax filings for review",
    dataUsed: ["Tax filing data", "Historical patterns", "Third-party income verification"],
    humanOversight: "All flagged cases reviewed by tax auditor before action",
    appealProcess: "Standard tax appeal process applies",
    deploymentDate: "2023-01-10",
    lastAudit: "2025-09-30",
    complianceScore: 96,
    vendor: "In-house Development",
    biasTestResults: {
      income: "Pass",
      geography: "Pass",
      businessType: "Monitoring",
    },
    incidents: 0,
    documentsPublic: 10,
  },
  {
    id: "ai-005",
    name: "Citizen Service Chatbot",
    department: "Citizen Services",
    riskLevel: "minimal",
    status: "active",
    purpose: "Answers common questions and routes inquiries to appropriate departments",
    dataUsed: ["User queries", "Department FAQs", "Service catalog"],
    humanOversight: "Escalation to human agent available at any time",
    appealProcess: "N/A - Informational only",
    deploymentDate: "2024-01-15",
    lastAudit: "2025-08-10",
    complianceScore: 99,
    vendor: "ConversAI Gov",
    biasTestResults: null,
    incidents: 0,
    documentsPublic: 5,
  },
  {
    id: "ai-006",
    name: "Predictive Maintenance System",
    department: "Public Works",
    riskLevel: "limited",
    status: "active",
    purpose: "Predicts infrastructure maintenance needs to optimize repair schedules",
    dataUsed: ["Sensor data", "Maintenance history", "Weather patterns", "Usage metrics"],
    humanOversight: "Maintenance supervisor approves all work orders",
    appealProcess: "N/A - Internal operations",
    deploymentDate: "2024-09-01",
    lastAudit: "2025-07-25",
    complianceScore: 97,
    vendor: "InfraTech AI",
    biasTestResults: null,
    incidents: 0,
    documentsPublic: 6,
  },
];

const departments = [
  "All Departments",
  "Department of Social Services",
  "Department of Transportation",
  "Human Resources",
  "Revenue & Taxation",
  "Citizen Services",
  "Public Works",
];

const riskLevels = ["All Risk Levels", "high", "limited", "minimal"];

function RiskBadge({ level }: { level: string }) {
  const config = {
    high: { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "High Risk" },
    limited: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "Limited Risk" },
    minimal: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", label: "Minimal Risk" },
  };
  const { color, label } = config[level as keyof typeof config] || config.limited;
  return <Badge variant="outline" className={color}>{label}</Badge>;
}

function AISystemCard({ system }: { system: typeof publicAISystems[0] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          className="group cursor-pointer rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-medium text-foreground group-hover:text-primary">
                {system.name}
              </h3>
              <p className="text-sm text-muted-foreground">{system.department}</p>
            </div>
            <RiskBadge level={system.riskLevel} />
          </div>

          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {system.purpose}
          </p>

          <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Deployed {new Date(system.deploymentDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {system.complianceScore}% compliant
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-4">
            <div className="flex items-center gap-2">
              {system.incidents > 0 ? (
                <span className="flex items-center gap-1 text-xs text-amber-500">
                  <AlertTriangle className="h-3 w-3" />
                  {system.incidents} incident{system.incidents > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-emerald-500">
                  <CheckCircle className="h-3 w-3" />
                  No incidents
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-primary">
              View Details
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{system.name}</DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">{system.department}</p>
            </div>
            <RiskBadge level={system.riskLevel} />
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Purpose */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Purpose</h4>
            <p className="text-sm text-muted-foreground">{system.purpose}</p>
          </div>

          {/* Data Used */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Data Used</h4>
            <div className="flex flex-wrap gap-2">
              {system.dataUsed.map((data) => (
                <Badge key={data} variant="secondary" className="text-xs">
                  {data}
                </Badge>
              ))}
            </div>
          </div>

          {/* Human Oversight */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Human Oversight</h4>
            <p className="text-sm text-muted-foreground">{system.humanOversight}</p>
          </div>

          {/* Appeal Process */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Appeal Process</h4>
            <p className="text-sm text-muted-foreground">{system.appealProcess}</p>
          </div>

          {/* Bias Testing */}
          {system.biasTestResults && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-foreground">Bias Testing Results</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(system.biasTestResults).map(([category, result]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-3 py-2"
                  >
                    <span className="text-xs capitalize text-muted-foreground">{category}</span>
                    <Badge
                      variant="outline"
                      className={
                        result === "Pass"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }
                    >
                      {result}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance & Audit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">Compliance Score</p>
              <p className="text-2xl font-semibold text-foreground">{system.complianceScore}%</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">Last Audit</p>
              <p className="text-lg font-medium text-foreground">
                {new Date(system.lastAudit).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Vendor */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Vendor</h4>
            <p className="text-sm text-muted-foreground">{system.vendor}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-border/50 pt-4">
            <Button variant="outline" className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              View {system.documentsPublic} Public Documents
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function TransparencyPortal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedRisk, setSelectedRisk] = useState("All Risk Levels");

  const filteredSystems = publicAISystems.filter((system) => {
    const matchesSearch =
      system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" || system.department === selectedDepartment;
    const matchesRisk =
      selectedRisk === "All Risk Levels" || system.riskLevel === selectedRisk;
    return matchesSearch && matchesDepartment && matchesRisk;
  });

  const stats = {
    total: publicAISystems.length,
    highRisk: publicAISystems.filter((s) => s.riskLevel === "high").length,
    avgCompliance: Math.round(
      publicAISystems.reduce((acc, s) => acc + s.complianceScore, 0) / publicAISystems.length
    ),
    totalIncidents: publicAISystems.reduce((acc, s) => acc + s.incidents, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo-icon.svg" alt="Parity AI" className="h-8 w-8" />
                <span className="text-lg font-semibold text-foreground">Parity AI</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Public Transparency Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                FOIA Export
              </Button>
              <Link to="/dashboard">
                <Button size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent py-16">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Eye className="h-4 w-4" />
              Public Access
            </div>
            <h1 className="mb-4 text-4xl font-light text-foreground sm:text-5xl">
              AI Systems Transparency Portal
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Explore all artificial intelligence systems deployed by our government.
              This portal provides citizens with full visibility into how AI affects public services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border/50 py-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
              <p className="text-3xl font-semibold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">AI Systems</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
              <p className="text-3xl font-semibold text-red-500">{stats.highRisk}</p>
              <p className="text-sm text-muted-foreground">High-Risk Systems</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
              <p className="text-3xl font-semibold text-primary">{stats.avgCompliance}%</p>
              <p className="text-sm text-muted-foreground">Avg Compliance</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
              <p className="text-3xl font-semibold text-amber-500">{stats.totalIncidents}</p>
              <p className="text-sm text-muted-foreground">Total Incidents</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border/50 py-6">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search AI systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-[250px]">
                <Building2 className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger className="w-full md:w-[180px]">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "All Risk Levels" ? level : `${level.charAt(0).toUpperCase() + level.slice(1)} Risk`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* AI Systems Grid */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredSystems.length} of {publicAISystems.length} systems
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSystems.map((system) => (
              <AISystemCard key={system.id} system={system} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            This transparency portal is part of our commitment to democratic AI accountability.
            <br />
            For FOIA requests or questions, contact{" "}
            <a href="mailto:transparency@gov.example" className="text-primary hover:underline">
              transparency@gov.example
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
