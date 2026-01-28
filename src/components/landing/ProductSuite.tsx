import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, DollarSign, Tv, Building2, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5 },
};

const products = [
  {
    id: "fairhire",
    name: "FairHire AI",
    description: "Bias testing & compliance monitoring for HR and hiring AI systems. NYC Local Law 144 ready.",
    icon: Users,
    status: "active" as const,
    href: "/dashboard",
    features: ["Adverse Impact Analysis", "Candidate Scoring Audits", "EEOC Compliance"],
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    id: "medparity",
    name: "MedParity",
    description: "Bias testing for clinical AI, diagnostic systems & treatment recommendation algorithms.",
    icon: Heart,
    status: "coming-soon" as const,
    href: "/products/medparity",
    features: ["Clinical Fairness Metrics", "FDA Guidelines", "Patient Safety"],
    gradient: "from-rose-500/10 to-pink-500/10",
  },
  {
    id: "finparity",
    name: "FinParity",
    description: "Lending, credit scoring & insurance underwriting fairness testing and monitoring.",
    icon: DollarSign,
    status: "coming-soon" as const,
    href: "/products/finparity",
    features: ["ECOA Compliance", "Fair Lending Analysis", "Risk Model Audits"],
    gradient: "from-amber-500/10 to-yellow-500/10",
  },
  {
    id: "contentguard",
    name: "ContentGuard",
    description: "Content moderation, recommendation systems & ad targeting fairness analysis.",
    icon: Tv,
    status: "coming-soon" as const,
    href: "/products/contentguard",
    features: ["Algorithm Transparency", "User Impact Analysis", "Content Equity"],
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    id: "enterprise",
    name: "Enterprise AI Governance",
    description: "General-purpose AI governance for any business application across your organization.",
    icon: Building2,
    status: "coming-soon" as const,
    href: "/products/enterprise",
    features: ["Cross-domain Audits", "Custom Frameworks", "Enterprise Scale"],
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
];

export function ProductSuite() {
  return (
    <section 
      className="relative bg-muted/30 py-24 sm:py-32" 
      id="products"
      aria-labelledby="products-heading"
    >
      {/* Decorative grid background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true"
      />
      
      <div className="container relative">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          {...fadeInUp}
        >
          <Badge 
            variant="outline" 
            className="mb-4 border-primary/20 bg-primary/5 text-primary"
          >
            Product Suite
          </Badge>
          <h2 
            id="products-heading"
            className="mb-4 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            style={{ textWrap: "balance" }}
          >
            Domain-Specific AI Governance
          </h2>
          <p className="text-pretty text-lg text-muted-foreground" style={{ textWrap: "pretty" }}>
            Purpose-built solutions for every industry's unique compliance needs
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`group relative h-full overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${
                  product.status === "coming-soon" ? "opacity-80" : ""
                }`}
              >
                {/* Gradient background on hover */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  aria-hidden="true"
                />
                
                <CardHeader className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:ring-primary/20">
                      <product.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    {product.status === "active" ? (
                      <Badge className="bg-success/10 text-success hover:bg-success/20">
                        <span className="relative mr-1.5 flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                        </span>
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-muted">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl transition-colors duration-200 group-hover:text-primary">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  <ul className="mb-6 space-y-2.5" role="list">
                    {product.features.map((feature) => (
                      <li 
                        key={feature} 
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    to={product.href}
                    className={product.status === "coming-soon" ? "pointer-events-none" : ""}
                    tabIndex={product.status === "coming-soon" ? -1 : 0}
                    aria-disabled={product.status === "coming-soon"}
                  >
                    <Button
                      variant={product.status === "active" ? "default" : "outline"}
                      className={`w-full gap-2 transition-all duration-300 ${
                        product.status === "active" 
                          ? "shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30" 
                          : ""
                      }`}
                      disabled={product.status === "coming-soon"}
                    >
                      {product.status === "active" ? (
                        <>
                          Get Started
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                        </>
                      ) : (
                        "Notify Me"
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
