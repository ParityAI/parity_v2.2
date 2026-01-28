import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-32 pb-20">
      {/* Gradient glow effect */}
      <div 
        className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
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
          <h1 className="mb-6 text-5xl font-light leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Take Control of{" "}
            <br className="hidden sm:block" />
            Your AI Systems
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Parity AI offers a seamless, secure experience for AI governance.
            <br className="hidden sm:block" />
            Instant audits, optimized compliance, and premium design.
          </p>

          {/* CTA Button */}
          <Link to="/auth">
            <Button 
              size="lg" 
              className="group rounded-full bg-primary px-8 py-6 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Get started now
              <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </Link>

          {/* Trust Badge */}
          <div className="mt-12 flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">They trust us</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
              <Star className="h-5 w-5 fill-primary/50 text-primary" />
              <span className="ml-2 text-foreground">4.9</span>
              <span className="ml-1 text-muted-foreground">G</span>
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
          <div className="glow-primary mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card">
            {/* Dashboard Header */}
            <div className="flex items-center gap-4 border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">P</span>
                </div>
                <span className="font-medium text-foreground">Parity AI</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Governance / Dashboard</p>
                <p className="text-sm font-medium text-foreground">Main Dashboard</p>
              </div>
            </div>
            
            {/* Dashboard Content Placeholder */}
            <div className="grid grid-cols-12 gap-4 p-6">
              {/* Sidebar */}
              <div className="col-span-3 space-y-2">
                {["Dashboard", "Models", "Vendors", "Compliance"].map((item, i) => (
                  <div 
                    key={item}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      i === 0 ? "bg-secondary text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              
              {/* Main Content */}
              <div className="col-span-6 space-y-4">
                <div className="rounded-xl border border-border bg-secondary/50 p-6">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Compliance Score</span>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>1D</span>
                      <span>7D</span>
                      <span>1M</span>
                      <span className="rounded bg-secondary px-2 py-0.5 text-foreground">1Y</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-foreground">94.7%</span>
                    <span className="text-sm text-primary">+12.3%</span>
                  </div>
                  {/* Chart placeholder */}
                  <div className="mt-4 h-32 w-full">
                    <svg className="h-full w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <path
                        d="M0,80 Q50,70 100,60 T200,50 T300,30 T400,20"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                      <path
                        d="M0,80 Q50,70 100,60 T200,50 T300,30 T400,20 L400,100 L0,100 Z"
                        fill="url(#gradient)"
                        opacity="0.2"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Models", value: "24" },
                    { label: "Vendors", value: "12" },
                    { label: "Incidents", value: "3" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Panel */}
              <div className="col-span-3 space-y-4">
                <div className="rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="mb-4 font-medium text-foreground">Quick Audit</p>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                      Select Model...
                    </div>
                    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                      Framework...
                    </div>
                    <Button className="w-full bg-secondary text-foreground hover:bg-secondary/80">
                      Run Audit →
                    </Button>
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
