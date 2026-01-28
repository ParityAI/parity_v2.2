import { Badge } from "@/components/ui/badge";
import { Shield, Globe, FileText, CheckCircle, Scale, Building } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5 },
};

const frameworks = [
  {
    name: "NYC Local Law 144",
    shortName: "LL144",
    region: "USA",
    icon: Shield,
    description: "Automated employment decision tools compliance",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "EU AI Act",
    shortName: "EU AI",
    region: "Europe",
    icon: Globe,
    description: "High-risk AI system requirements",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Colorado AI Act",
    shortName: "CO AI",
    region: "USA",
    icon: FileText,
    description: "Consumer protection in automated decisions",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Illinois AIVOIA",
    shortName: "AIVOIA",
    region: "USA",
    icon: Scale,
    description: "Video interview analysis requirements",
    color: "from-violet-500 to-violet-600",
  },
  {
    name: "ISO 42001",
    shortName: "ISO",
    region: "Global",
    icon: CheckCircle,
    description: "AI management system standard",
    color: "from-teal-500 to-teal-600",
  },
  {
    name: "NIST AI RMF",
    shortName: "NIST",
    region: "Global",
    icon: Building,
    description: "Risk management framework",
    color: "from-emerald-500 to-emerald-600",
  },
];

export function ComplianceFrameworks() {
  return (
    <section 
      className="relative overflow-hidden bg-background py-24 sm:py-32" 
      id="compliance"
      aria-labelledby="compliance-heading"
    >
      {/* Decorative background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/5 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container relative">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          {...fadeInUp}
        >
          <Badge 
            variant="outline" 
            className="mb-4 border-primary/20 bg-primary/5 text-primary"
          >
            Compliance
          </Badge>
          <h2 
            id="compliance-heading"
            className="mb-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            style={{ textWrap: "balance" }}
          >
            Multi-Framework Compliance
          </h2>
          <p className="text-pretty text-lg text-muted-foreground" style={{ textWrap: "pretty" }}>
            Stay ahead of global AI regulations with automated compliance monitoring
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((framework, index) => (
            <motion.div
              key={framework.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <article className="relative flex h-full items-start gap-4 overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
                {/* Gradient accent bar */}
                <div 
                  className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${framework.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  aria-hidden="true"
                />
                
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:ring-primary/20">
                  <framework.icon 
                    className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" 
                    aria-hidden="true" 
                  />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                      {framework.name}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className="shrink-0 border-border/50 bg-muted/50 text-xs font-medium"
                    >
                      {framework.region}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {framework.description}
                  </p>
                </div>
              </article>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="mb-4 text-muted-foreground">
            Need a custom framework? We support custom compliance requirements.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Contact us for custom solutions →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
