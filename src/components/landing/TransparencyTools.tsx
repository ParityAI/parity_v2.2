import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  CreditCard,
  GitCompare,
  Grid3X3,
  Megaphone,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    icon: Globe,
    name: "Citizen Transparency Portal",
    description: "Public-facing read-only view of all AI systems your government uses. Radical transparency for citizens and oversight bodies.",
    href: "/public/transparency",
    color: "emerald",
    badge: "Public Access",
  },
  {
    icon: CreditCard,
    name: "AI System Card Generator",
    description: "Create shareable, embeddable cards for your AI deployments. Like model cards, but for entire systems.",
    href: "/dashboard",
    color: "blue",
    badge: "Embeddable",
  },
  {
    icon: GitCompare,
    name: "Comparative Framework View",
    description: "See how one AI system maps to EU AI Act, NIST, and ISO simultaneously. Cross-framework compliance at a glance.",
    href: "/dashboard",
    color: "violet",
    badge: "Multi-Framework",
  },
  {
    icon: Grid3X3,
    name: "Risk Heatmap by Department",
    description: "Visual dashboard for executives showing AI risk across government departments. Identify gaps instantly.",
    href: "/dashboard",
    color: "amber",
    badge: "Executive View",
  },
  {
    icon: Megaphone,
    name: "Incident Public Disclosure",
    description: "When AI incidents happen, generate citizen-facing disclosure templates. Accountability when it matters most.",
    href: "/dashboard",
    color: "rose",
    badge: "Citizen-Ready",
  },
  {
    icon: Download,
    name: "FOIA-Ready Export",
    description: "One-click export of all audit data in formats journalists and citizens can request under freedom of information laws.",
    href: "/dashboard",
    color: "cyan",
    badge: "Open Data",
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
};

export function TransparencyTools() {
  return (
    <section className="relative bg-background py-24">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Globe className="h-4 w-4" />
            New: Transparency Tools
          </div>
          <h2 className="mb-4 text-4xl font-light text-foreground sm:text-5xl">
            Radical Transparency Infrastructure
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Tools designed for democratic accountability. Make AI governance visible to citizens,
            journalists, and oversight bodies.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => {
            const colors = colorClasses[tool.color];
            return (
              <motion.div
                key={tool.name}
                className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-card/50 p-6 transition-all hover:bg-card`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Badge */}
                <div className="absolute right-4 top-4">
                  <span className={`rounded-full ${colors.bg} px-2 py-0.5 text-xs font-medium ${colors.text}`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}>
                  <tool.icon className={`h-6 w-6 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-medium text-foreground">{tool.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{tool.description}</p>

                {/* Link */}
                <Link
                  to={tool.href}
                  className={`inline-flex items-center gap-1 text-sm font-medium ${colors.text} transition-colors hover:underline`}
                >
                  {tool.href === "/public/transparency" ? "View Public Portal" : "Try in Demo"}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="mb-6 text-muted-foreground">
            All transparency tools are included in the open source platform.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/public/transparency">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-primary/50 px-8"
              >
                <Globe className="mr-2 h-4 w-4" />
                View Public Portal
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full bg-primary px-8 text-primary-foreground">
                Try All Tools
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
