import { Badge } from "@/components/ui/badge";
import { Shield, Globe, FileText, CheckCircle } from "lucide-react";

const frameworks = [
  {
    name: "NYC Local Law 144",
    region: "USA",
    icon: Shield,
    description: "Automated employment decision tools compliance",
  },
  {
    name: "EU AI Act",
    region: "Europe",
    icon: Globe,
    description: "High-risk AI system requirements",
  },
  {
    name: "Colorado AI Act",
    region: "USA",
    icon: FileText,
    description: "Consumer protection in automated decisions",
  },
  {
    name: "Illinois AIVOIA",
    region: "USA",
    icon: Shield,
    description: "Video interview analysis requirements",
  },
  {
    name: "ISO 42001",
    region: "Global",
    icon: CheckCircle,
    description: "AI management system standard",
  },
  {
    name: "NIST AI RMF",
    region: "Global",
    icon: FileText,
    description: "Risk management framework",
  },
];

export function ComplianceFrameworks() {
  return (
    <section className="bg-background py-24" id="compliance">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Multi-Framework Compliance
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay ahead of global AI regulations with automated compliance monitoring
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((framework) => (
            <div
              key={framework.name}
              className="group flex items-start gap-4 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                <framework.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{framework.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {framework.region}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{framework.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
