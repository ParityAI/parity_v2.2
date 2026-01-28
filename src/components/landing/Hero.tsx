import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart3, FileCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const trustIndicators = [
  {
    icon: Shield,
    title: "Multi-Framework Compliance",
    description: "NYC LL144, EU AI Act, Colorado AI Act, ISO 42001 & more",
  },
  {
    icon: BarChart3,
    title: "Bias Analytics",
    description: "Adverse impact ratios, demographic parity & fairness metrics",
  },
  {
    icon: FileCheck,
    title: "Audit-Ready Reports",
    description: "Generate compliance documentation with one click",
  },
];

export function Hero() {
  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-accent/20 py-24 sm:py-32"
      aria-labelledby="hero-heading"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>
      
      <div className="container relative">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Status badge */}
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
            variants={fadeInUp}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>NYC Local Law 144 Compliant</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            id="hero-heading"
            className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            variants={fadeInUp}
            style={{ textWrap: "balance" }}
          >
            Fairness Testing for{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Every AI System
              </span>
              <span 
                className="absolute -inset-x-2 -inset-y-1 -z-10 -rotate-1 rounded-lg bg-primary/10"
                aria-hidden="true"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
            variants={fadeInUp}
            style={{ textWrap: "pretty" }}
          >
            Automate compliance, improve trust & reduce risk across your AI portfolio.
            Multi-framework governance for HR, healthcare, finance & beyond.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={fadeInUp}
          >
            <Link to="/auth" className="group">
              <Button 
                size="lg" 
                className="gap-2 px-8 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
              >
                Get Started Free
                <ArrowRight 
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
                  aria-hidden="true"
                />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="border-border/50 backdrop-blur-sm hover:bg-accent/50"
            >
              Request a Demo
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.p
            className="mt-8 text-sm text-muted-foreground"
            variants={fadeInUp}
          >
            Trusted by leading enterprises for AI governance
          </motion.p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {trustIndicators.map((item, index) => (
            <motion.div
              key={item.title}
              className="group relative flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/10">
                <item.icon className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
