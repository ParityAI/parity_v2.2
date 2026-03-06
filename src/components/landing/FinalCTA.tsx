import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-background py-32">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Background glow */}
      <div 
        className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[1000px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(160 84% 54% / 0.08) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      
      <div className="container relative">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-4xl font-light text-foreground sm:text-5xl md:text-6xl">
            AI Accountability
            <br />
            Starts Here
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Join public institutions building transparent, accountable AI systems. Free for government pilots. Open source forever.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="group rounded-full bg-primary px-8 py-6 text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_40px_-8px_hsl(160_84%_54%/0.5)]"
              >
                Try Live Demo
                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="group rounded-full border-primary/50 px-8 py-6 text-base font-medium transition-all duration-300 hover:bg-primary/10 hover:border-primary"
              onClick={() => window.open('mailto:pilots@parityai.io?subject=Public Sector Pilot Inquiry', '_blank')}
            >
              Request Pilot Access
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
