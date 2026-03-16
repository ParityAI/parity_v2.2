import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Radar,
  Search,
  Brain,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Globe,
  AlertTriangle,
  FileDown,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const phases = [
  {
    step: "01",
    icon: Search,
    title: "Detect",
    subtitle: "Autonomous Web Agents",
    description:
      "Four AI-powered agents continuously browse government regulatory sources — EUR-Lex, EU AI Office, NIST, and NYC LL144 — extracting new rules, amendments, and enforcement actions in real time.",
    color: "blue",
  },
  {
    step: "02",
    icon: Brain,
    title: "Classify",
    subtitle: "LLM-Powered Analysis",
    description:
      "Raw regulatory text is processed by Llama 3.1 70B to classify severity (Critical / Major / Moderate / Minor), assign compliance categories, and generate recommended actions for your team.",
    color: "violet",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "Enforce",
    subtitle: "Automatic Risk Register",
    description:
      "Classified alerts are automatically saved as tracked risks in your Risk Register with full source attribution, creating an audit trail from detection to mitigation.",
    color: "emerald",
  },
];

const highlights = [
  {
    icon: Bot,
    text: "4 autonomous agents monitoring regulatory sources 24/7",
  },
  {
    icon: AlertTriangle,
    text: "Real-time severity classification with AI-powered analysis",
  },
  {
    icon: Globe,
    text: "Covers EU AI Act, NIST AI RMF, NYC Local Law 144 & more",
  },
  {
    icon: FileDown,
    text: "One-click PDF compliance reports with full audit trail",
  },
];

const phaseColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/5",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    glow: "shadow-violet-500/5",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/5",
  },
};

export function RegulatoryRadarShowcase() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Subtle background radar pulse */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/[0.02]" />
      </div>

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Radar className="h-4 w-4" />
            New: RegulatoryRadar
          </div>
          <h2 className="mb-4 text-4xl font-light text-foreground sm:text-5xl">
            Autonomous Compliance Enforcement
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            AI agents that never sleep. RegulatoryRadar continuously monitors global regulatory
            sources, classifies new requirements, and enforces them into your risk register —
            automatically.
          </p>
        </motion.div>

        {/* 3-Phase Pipeline */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {phases.map((phase, index) => {
            const colors = phaseColors[phase.color];
            return (
              <motion.div
                key={phase.title}
                className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-card/50 p-8 transition-all hover:bg-card hover:shadow-xl ${colors.glow}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Step number */}
                <div className="absolute right-6 top-6">
                  <span className="text-5xl font-extralight text-muted-foreground/20">
                    {phase.step}
                  </span>
                </div>

                {/* Icon */}
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg}`}>
                  <phase.icon className={`h-7 w-7 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="mb-1 text-xl font-semibold text-foreground">{phase.title}</h3>
                <p className={`mb-3 text-sm font-medium ${colors.text}`}>{phase.subtitle}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {phase.description}
                </p>

                {/* Connector arrow (between cards) */}
                {index < 2 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
                      <Zap className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Highlights Grid */}
        <motion.div
          className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {highlights.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/30 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Powered By + CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Powered by
          </p>
          <div className="mb-8 flex items-center justify-center gap-6">
            <span className="rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground">
              TinyFish AI Agents
            </span>
            <span className="text-muted-foreground/30">+</span>
            <span className="rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground">
              Fireworks AI — Llama 3.1 70B
            </span>
            <span className="text-muted-foreground/30">+</span>
            <span className="rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground">
              Supabase
            </span>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/auth">
              <Button size="lg" className="rounded-full bg-primary px-8 text-primary-foreground">
                <Radar className="mr-2 h-4 w-4" />
                Try RegulatoryRadar
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-primary/50 px-8"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
