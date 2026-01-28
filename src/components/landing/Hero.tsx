import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Copy, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

const leaderboardData = [
  { rank: 1, name: "GPT-4 Hiring Model", org: "acme-corp/hr-ai", installs: "94.7%", trend: "up" },
  { rank: 2, name: "Resume Parser v3", org: "techflow/parsing", installs: "92.3%", trend: "up" },
  { rank: 3, name: "Salary Predictor", org: "fintech-labs/comp", installs: "89.1%", trend: "stable" },
  { rank: 4, name: "Candidate Matcher", org: "acme-corp/matching", installs: "87.5%", trend: "down" },
  { rank: 5, name: "Interview Scheduler", org: "scheduling-ai/core", installs: "85.2%", trend: "up" },
  { rank: 6, name: "Bias Detector", org: "fairml/detection", installs: "83.9%", trend: "up" },
  { rank: 7, name: "Performance Review", org: "hr-suite/reviews", installs: "81.4%", trend: "stable" },
  { rank: 8, name: "Onboarding Assistant", org: "employee-exp/assist", installs: "79.8%", trend: "up" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-32 pb-20">
      {/* Subtle gradient background */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, hsl(160 84% 54% / 0.08), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsl(160 84% 54% / 0.04), transparent)
          `
        }}
        aria-hidden="true"
      />
      
      <div className="container relative">
        {/* Hero Content - Two Column Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* ASCII-inspired logo accent */}
            <div className="mb-6 font-mono text-xs text-muted-foreground/60 leading-tight hidden sm:block">
              <pre className="whitespace-pre">{`
██████╗  █████╗ ██████╗ ██╗████████╗██╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝
██████╔╝███████║██████╔╝██║   ██║    ╚████╔╝ 
██╔═══╝ ██╔══██║██╔══██╗██║   ██║     ╚██╔╝  
██║     ██║  ██║██║  ██║██║   ██║      ██║   
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝   
              `.trim()}</pre>
            </div>
            
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">
              The AI Governance Platform
            </p>

            {/* Main Heading */}
            <h1 className="mb-6 text-4xl font-light leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Take Control of Your AI Systems
            </h1>

            {/* Subtitle */}
            <p className="mb-8 max-w-md text-base text-muted-foreground">
              Monitor, audit, and ensure compliance for all your AI models. 
              Real-time governance with instant insights.
            </p>

            {/* Terminal Command Box */}
            <div className="mb-8 max-w-md">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Get started in one command
              </p>
              <div className="group flex items-center justify-between rounded-lg border border-border bg-card/80 px-4 py-3 font-mono text-sm transition-colors hover:border-primary/30">
                <span>
                  <span className="text-muted-foreground">$ </span>
                  <span className="text-foreground">npx parity-ai init</span>
                </span>
                <button className="text-muted-foreground transition-colors hover:text-foreground">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden rounded-lg bg-primary px-6 py-5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
                >
                  <span className="relative z-10 flex items-center">
                    Get started now
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Button>
              </Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                View demo →
              </Link>
            </div>

            {/* Available Frameworks */}
            <div className="mt-10">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Compliance frameworks supported
              </p>
              <div className="flex flex-wrap gap-2">
                {["NYC LL144", "EU AI Act", "DPDPA 🇮🇳", "ISO 42001", "NIST RMF", "Colorado AI"].map((framework) => (
                  <span 
                    key={framework}
                    className="rounded border border-border/50 bg-secondary/30 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Leaderboard Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
              {/* Leaderboard Header */}
              <div className="border-b border-border/50 p-5">
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Model Compliance Leaderboard
                </p>
                
                {/* Search Bar */}
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm text-muted-foreground">Search models...</span>
                  <span className="rounded border border-border bg-secondary/50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">/</span>
                </div>
                
                {/* Filter Tabs */}
                <div className="mt-4 flex gap-4 font-mono text-xs">
                  <span className="border-b-2 border-primary pb-1 text-foreground">All Time (847)</span>
                  <span className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer">Trending (24h)</span>
                  <span className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer">Hot</span>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="divide-y divide-border/30">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <div className="col-span-1">#</div>
                  <div className="col-span-7">Model</div>
                  <div className="col-span-2 text-right">Score</div>
                  <div className="col-span-2 text-right">Trend</div>
                </div>
                
                {/* Table Rows */}
                {leaderboardData.map((item, index) => (
                  <motion.div
                    key={item.rank}
                    className="grid grid-cols-12 gap-4 px-5 py-3 text-sm transition-colors hover:bg-secondary/20 cursor-pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  >
                    <div className="col-span-1 font-mono text-muted-foreground">{item.rank}</div>
                    <div className="col-span-7">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">{item.org}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="font-mono text-primary">{item.installs}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      {item.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-primary" />}
                      {item.trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                      {item.trend === "stable" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer Stats */}
              <div className="border-t border-border/50 px-5 py-4">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Total Models", value: "847" },
                    { label: "Active Orgs", value: "234" },
                    { label: "Avg Score", value: "87.3%" },
                    { label: "Audits Today", value: "1.2K" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="font-mono text-lg font-medium text-foreground">{stat.value}</p>
                      <p className="font-mono text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
