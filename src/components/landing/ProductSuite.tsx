import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, DollarSign, Tv, Building2, ArrowRight } from "lucide-react";

const products = [
  {
    id: "fairhire",
    name: "FairHire AI",
    description: "Bias testing and compliance monitoring for HR and hiring AI systems. NYC Local Law 144 ready.",
    icon: Users,
    status: "active" as const,
    href: "/dashboard",
    features: ["Adverse Impact Analysis", "Candidate Scoring Audits", "EEOC Compliance"],
  },
  {
    id: "medparity",
    name: "MedParity",
    description: "Bias testing for clinical AI, diagnostic systems, and treatment recommendation algorithms.",
    icon: Heart,
    status: "coming-soon" as const,
    href: "/products/medparity",
    features: ["Clinical Fairness Metrics", "FDA Guidelines", "Patient Safety"],
  },
  {
    id: "finparity",
    name: "FinParity",
    description: "Lending, credit scoring, and insurance underwriting fairness testing and monitoring.",
    icon: DollarSign,
    status: "coming-soon" as const,
    href: "/products/finparity",
    features: ["ECOA Compliance", "Fair Lending Analysis", "Risk Model Audits"],
  },
  {
    id: "contentguard",
    name: "ContentGuard",
    description: "Content moderation, recommendation systems, and ad targeting fairness analysis.",
    icon: Tv,
    status: "coming-soon" as const,
    href: "/products/contentguard",
    features: ["Algorithm Transparency", "User Impact Analysis", "Content Equity"],
  },
  {
    id: "enterprise",
    name: "Enterprise AI Governance",
    description: "General-purpose AI governance for any business application across your organization.",
    icon: Building2,
    status: "coming-soon" as const,
    href: "/products/enterprise",
    features: ["Cross-domain Audits", "Custom Frameworks", "Enterprise Scale"],
  },
];

export function ProductSuite() {
  return (
    <section className="bg-muted/50 py-24">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Domain-Specific AI Governance
          </h2>
          <p className="text-lg text-muted-foreground">
            Purpose-built solutions for every industry's unique compliance needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className={`relative transition-all hover:shadow-lg ${
                product.status === "coming-soon" ? "opacity-75" : ""
              }`}
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <product.icon className="h-5 w-5 text-primary" />
                  </div>
                  {product.status === "active" ? (
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Coming Soon</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={product.href}>
                  <Button 
                    variant={product.status === "active" ? "default" : "outline"} 
                    className="w-full gap-2"
                    disabled={product.status === "coming-soon"}
                  >
                    {product.status === "active" ? (
                      <>
                        Get Started <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      "Notify Me"
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
