import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart3, FileCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success"></span>
            NYC Local Law 144 Compliant
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Fairness Testing for{" "}
            <span className="text-primary">Every AI System</span>
          </h1>
          
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Automate compliance, improve trust, and reduce risk across your AI portfolio. 
            Multi-framework governance for HR, healthcare, finance, and beyond.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Request Demo
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Multi-Framework Compliance</h3>
            <p className="text-sm text-muted-foreground">
              NYC LL144, EU AI Act, Colorado AI Act, ISO 42001, and more
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Bias Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Adverse impact ratios, demographic parity, and fairness metrics
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Audit-Ready Reports</h3>
            <p className="text-sm text-muted-foreground">
              Generate compliance documentation with one click
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
