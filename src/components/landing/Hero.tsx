import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Star, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-32 pb-20">
      {/* Subtle noise texture overlay */}
      <div className="noise pointer-events-none absolute inset-0" aria-hidden="true" />
      
      {/* Gradient mesh background */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, hsl(160 84% 54% / 0.12), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsl(160 84% 54% / 0.06), transparent),
            radial-gradient(ellipse 50% 30% at 20% 80%, hsl(160 84% 54% / 0.04), transparent)
          `
        }}
        aria-hidden="true"
      />
      
      {/* Bottom glow */}
      <div 
        className="pointer-events-none absolute bottom-0 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 translate-y-1/4"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(160 84% 54% / 0.15) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      
      <div className="container relative">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Take Control of{" "}
            <br className="hidden sm:block" />
            Your AI Systems
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Parity AI offers a seamless, secure experience for AI governance.
            <br className="hidden sm:block" />
            Instant audits, optimized compliance, and premium design.
          </p>

          {/* CTA Button */}
          <Link to="/auth">
            <Button 
              size="lg" 
              className="group relative overflow-hidden rounded-full bg-primary px-8 py-6 text-base font-medium text-primary-foreground transition-all duration-300 hover:shadow-[0_0_32px_-4px_hsl(160_84%_54%/0.5)]"
            >
              <span className="relative z-10 flex items-center">
                Get started now
                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Button>
          </Link>

          {/* Trust Badge */}
          <div className="mt-12 flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">They trust us</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
              <Star className="h-4 w-4 fill-primary/40 text-primary/40" />
              <span className="ml-2 text-sm font-medium text-foreground">4.9</span>
              <span className="ml-1 text-sm text-muted-foreground">G</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass glow-primary mx-auto max-w-6xl overflow-hidden rounded-2xl">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <span className="text-sm font-bold text-primary-foreground">P</span>
                  </div>
                  <span className="font-medium text-foreground">Parity AI</span>
                </div>
                <div className="h-6 w-px bg-border/50" />
                <div>
                  <p className="text-xs text-muted-foreground">Governance / Dashboard</p>
                  <p className="text-sm font-medium text-foreground">Main Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-secondary/80" />
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="grid grid-cols-12 gap-0">
              {/* Sidebar */}
              <div className="col-span-2 border-r border-border/50 bg-secondary/20 p-4">
                <div className="space-y-1">
                  {[
                    { name: "Dashboard", active: true },
                    { name: "Models", active: false },
                    { name: "Vendors", active: false },
                    { name: "Compliance", active: false },
                    { name: "Incidents", active: false },
                    { name: "Reports", active: false },
                  ].map((item) => (
                    <div 
                      key={item.name}
                      className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                        item.active 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Main Content */}
              <div className="col-span-10 p-6">
                {/* Stats Row */}
                <div className="mb-6 grid grid-cols-4 gap-4">
                  {[
                    { label: "Total Models", value: "24", change: "+3", icon: Shield, color: "text-primary" },
                    { label: "Active Vendors", value: "12", change: "+2", icon: CheckCircle, color: "text-emerald-400" },
                    { label: "Open Incidents", value: "3", change: "-2", icon: AlertTriangle, color: "text-amber-400" },
                    { label: "Compliance Score", value: "94.7%", change: "+5.2%", icon: Clock, color: "text-blue-400" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
                        <span className="text-xs text-primary">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Main Chart */}
                  <div className="col-span-2 glass-strong rounded-xl p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Compliance Trend</p>
                        <p className="text-xs text-muted-foreground">Last 12 months</p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="rounded bg-secondary px-2 py-1 text-muted-foreground">1M</span>
                        <span className="rounded bg-secondary px-2 py-1 text-muted-foreground">3M</span>
                        <span className="rounded bg-primary/20 px-2 py-1 text-primary">1Y</span>
                      </div>
                    </div>
                    {/* Chart */}
                    <div className="h-40 w-full">
                      <svg className="h-full w-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(160 84% 54%)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="hsl(160 84% 54%)" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        {[0, 30, 60, 90, 120].map((y) => (
                          <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="hsl(160 6% 15%)" strokeWidth="0.5" />
                        ))}
                        {/* Area fill */}
                        <path
                          d="M0,100 Q40,95 80,85 T160,75 T240,60 T320,50 T400,35 T500,25 L500,120 L0,120 Z"
                          fill="url(#chartGradient)"
                        />
                        {/* Line */}
                        <path
                          d="M0,100 Q40,95 80,85 T160,75 T240,60 T320,50 T400,35 T500,25"
                          fill="none"
                          stroke="hsl(160 84% 54%)"
                          strokeWidth="2"
                        />
                        {/* Data points */}
                        {[
                          { x: 0, y: 100 }, { x: 80, y: 85 }, { x: 160, y: 75 }, 
                          { x: 240, y: 60 }, { x: 320, y: 50 }, { x: 400, y: 35 }, { x: 500, y: 25 }
                        ].map((point, i) => (
                          <circle key={i} cx={point.x} cy={point.y} r="3" fill="hsl(160 84% 54%)" />
                        ))}
                      </svg>
                    </div>
                    {/* X-axis labels */}
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                    </div>
                  </div>

                  {/* Right Panel */}
                  <div className="space-y-4">
                    {/* Model Status */}
                    <div className="glass-strong rounded-xl p-4">
                      <p className="mb-3 text-sm font-medium text-foreground">Model Status</p>
                      <div className="space-y-2">
                        {[
                          { name: "GPT-4 Hiring", status: "Approved", color: "bg-emerald-500" },
                          { name: "Resume Parser", status: "Pending", color: "bg-amber-500" },
                          { name: "Salary Predictor", status: "Approved", color: "bg-emerald-500" },
                        ].map((model) => (
                          <div key={model.name} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-3 py-2">
                            <span className="text-xs text-foreground">{model.name}</span>
                            <div className="flex items-center gap-1.5">
                              <div className={`h-1.5 w-1.5 rounded-full ${model.color}`} />
                              <span className="text-xs text-muted-foreground">{model.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Distribution */}
                    <div className="glass-strong rounded-xl p-4">
                      <p className="mb-3 text-sm font-medium text-foreground">Risk Distribution</p>
                      <div className="flex items-center justify-center">
                        <svg className="h-24 w-24" viewBox="0 0 100 100">
                          {/* Donut chart */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(160 6% 15%)" strokeWidth="12" />
                          <circle 
                            cx="50" cy="50" r="40" fill="none" 
                            stroke="hsl(160 84% 54%)" strokeWidth="12"
                            strokeDasharray="176 251" strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                          <circle 
                            cx="50" cy="50" r="40" fill="none" 
                            stroke="hsl(38 92% 50%)" strokeWidth="12"
                            strokeDasharray="50 251" strokeDashoffset="-176"
                            transform="rotate(-90 50 50)"
                          />
                          <circle 
                            cx="50" cy="50" r="40" fill="none" 
                            stroke="hsl(0 84% 60%)" strokeWidth="12"
                            strokeDasharray="25 251" strokeDashoffset="-226"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                      </div>
                      <div className="mt-3 flex justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-muted-foreground">Low 70%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-muted-foreground">Med 20%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-destructive" />
                          <span className="text-muted-foreground">High 10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-4 glass-strong rounded-xl p-4">
                  <p className="mb-3 text-sm font-medium text-foreground">Recent Activity</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { action: "Audit completed", model: "GPT-4 Hiring", time: "2m ago", status: "success" },
                      { action: "Model registered", model: "Resume Parser v2", time: "1h ago", status: "info" },
                      { action: "Incident resolved", model: "Salary Predictor", time: "3h ago", status: "warning" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 px-3 py-2">
                        <div className={`h-2 w-2 rounded-full ${
                          activity.status === 'success' ? 'bg-emerald-500' :
                          activity.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{activity.action}</p>
                          <p className="text-xs text-muted-foreground truncate">{activity.model}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
