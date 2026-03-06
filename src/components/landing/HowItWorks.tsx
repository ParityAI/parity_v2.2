import { Link } from "react-router-dom";
import { ArrowUpRight, User, Cpu, BarChart3, Check, Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Create your account",
    description: "Sign up in seconds with enterprise-grade security. Get instant access to your personalized AI governance dashboard.",
    icon: User,
    features: ["SSO Integration", "Role-based access", "Secure by default"],
    preview: (
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Welcome to</p>
            <p className="text-sm font-medium text-foreground">Parity AI</p>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">Work Email</label>
          <div className="rounded-lg border border-border/50 bg-background/50 px-4 py-2.5 text-sm text-foreground">
            john@company.com
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">Password</label>
          <div className="rounded-lg border border-border/50 bg-background/50 px-4 py-2.5 text-sm text-muted-foreground">
            ••••••••••••
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-4 w-4 rounded border border-primary bg-primary/20 flex items-center justify-center">
            <Check className="h-2.5 w-2.5 text-primary" />
          </div>
          <span>I agree to the Terms of Service</span>
        </div>
        <div className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground">
          Create Account
        </div>
      </div>
    ),
  },
  {
    number: 2,
    title: "Connect your AI systems",
    description: "Seamlessly integrate your AI models, data sources, and third-party vendors with our unified platform.",
    icon: Cpu,
    features: ["One-click integration", "100+ connectors", "Real-time sync"],
    preview: (
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">GPT-4 Hiring Model</span>
              <p className="text-xs text-muted-foreground">OpenAI • v4.0</p>
            </div>
          </div>
          <span className="rounded-full bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">Connected</span>
        </div>
        <div className="rounded-lg border border-border/50 bg-background/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-secondary/80 flex items-center justify-center text-sm">🤖</div>
            <div>
              <span className="text-sm text-foreground">Claude Resume Screener</span>
              <p className="text-xs text-muted-foreground">Anthropic • v3.5</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-border/50 bg-background/20 px-4 py-3 text-center">
          <span className="text-xs text-muted-foreground">+ Add another model</span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-lg bg-secondary/40 px-3 py-2 text-center">
            <p className="text-lg font-semibold text-foreground">2</p>
            <p className="text-xs text-muted-foreground">Models</p>
          </div>
          <div className="rounded-lg bg-secondary/40 px-3 py-2 text-center">
            <p className="text-lg font-semibold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Data Sources</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    title: "Monitor & audit in real-time",
    description: "Get continuous compliance monitoring, bias detection alerts, and automated audit reports across all frameworks.",
    icon: BarChart3,
    features: ["24/7 monitoring", "Instant alerts", "Auto-reports"],
    preview: (
      <div className="space-y-2 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-foreground">Compliance Status</span>
          <span className="flex items-center gap-1 text-xs text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        </div>
        {[
          { name: "NYC LL144", score: 94.7, icon: "🏛️", status: "passed" },
          { name: "EU AI Act", score: 88.2, icon: "🇪🇺", status: "passed" },
          { name: "DPDPA India", score: 92.1, icon: "🇮🇳", status: "passed" },
          { name: "ISO 42001", score: 91.2, icon: "📋", status: "passed" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/80 text-sm">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary" 
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <span className="text-xs font-medium text-primary">{item.score}%</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-background py-24">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-4xl font-light text-foreground sm:text-5xl">
              How It Works
            </h2>
            <p className="max-w-lg text-muted-foreground">
              A simple, fast, and secure platform to manage your AI governance in just a few steps.
            </p>
          </motion.div>
          
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
          >
            Try the demo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-border via-primary/30 to-border" />
              )}
              
              {/* Step number badge */}
              <div className="absolute -top-3 left-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-card text-sm font-semibold text-primary shadow-lg shadow-primary/10">
                {step.number}
              </div>
              
              {/* Card */}
              <div className="glass overflow-hidden rounded-2xl transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5">
                {/* Preview */}
                <div className="min-h-[280px] border-b border-border/50 bg-gradient-to-b from-secondary/30 to-secondary/10">
                  {step.preview}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    {step.description}
                  </p>
                  
                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-2">
                    {step.features.map((feature) => (
                      <span 
                        key={feature}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        <Check className="h-3 w-3 text-primary" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            Try Live Demo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">Open source • Self-hosted option available</p>
        </motion.div>
      </div>
    </section>
  );
}
