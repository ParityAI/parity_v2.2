import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Create your account",
    description: "Sign up easily and secure your profile in just a few steps.",
    preview: (
      <div className="space-y-4 p-4">
        <div>
          <label className="mb-2 block text-xs text-muted-foreground">Email</label>
          <div className="rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm text-muted-foreground">
            john@company.com
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs text-muted-foreground">Password</label>
          <div className="rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm text-muted-foreground">
            ••••••••••••
          </div>
        </div>
        <div className="rounded-lg bg-secondary/60 px-4 py-3 text-center text-sm text-muted-foreground">
          Create account
        </div>
      </div>
    ),
  },
  {
    number: 2,
    title: "Connect your AI systems",
    description: "Register your AI models and connect to your data sources to start monitoring.",
    preview: (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-4 py-3">
          <span className="text-sm text-foreground">GPT-4 Hiring Model</span>
          <span className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">Connected</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Data Source</span>
            <span className="text-foreground">HRIS API</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Network Fee</span>
            <span className="text-foreground">0.0012 USDT</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total Credited</span>
            <span className="text-foreground">0.4988 USDT</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    title: "Monitor & audit",
    description: "Enjoy the simplicity of a platform that makes every compliance check seamless in real-time.",
    preview: (
      <div className="space-y-2 p-4">
        {[
          { name: "NYC LL144", score: "+94.7%", icon: "🏛️" },
          { name: "EU AI Act", score: "+88.2%", icon: "🇪🇺" },
          { name: "ISO 42001", score: "+91.2%", icon: "📋" },
          { name: "NIST AI RMF", score: "+89.5%", icon: "🔒" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80 text-sm">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-foreground">{item.name}</span>
            </div>
            <span className="text-sm text-primary">{item.score}</span>
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
            to="/auth" 
            className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
          >
            Create account now
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Step number */}
              <div className="absolute -top-3 left-4 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-card text-sm font-medium text-foreground backdrop-blur-sm">
                {step.number}
              </div>
              
              {/* Card */}
              <div className="glass overflow-hidden rounded-2xl transition-all duration-300 group-hover:border-primary/20">
                {/* Preview */}
                <div className="min-h-[240px] border-b border-border/50 bg-secondary/20">
                  {step.preview}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
