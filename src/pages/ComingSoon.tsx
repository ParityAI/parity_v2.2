import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Heart, DollarSign, Tv, Building2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const products = {
  medparity: {
    name: "MedParity",
    tagline: "Healthcare AI Governance",
    description: "Bias testing for clinical AI, diagnostic systems, and treatment recommendation algorithms. Ensure patient safety and equitable healthcare outcomes.",
    icon: Heart,
    features: [
      "Clinical decision support fairness analysis",
      "Diagnostic algorithm bias detection",
      "Treatment recommendation equity monitoring",
      "FDA AI/ML guidelines compliance",
      "Patient outcome disparity tracking",
    ],
  },
  finparity: {
    name: "FinParity",
    tagline: "Financial AI Governance",
    description: "Lending, credit scoring, and insurance underwriting fairness testing. Comply with ECOA, Fair Housing Act, and emerging AI regulations.",
    icon: DollarSign,
    features: [
      "Credit scoring bias analysis",
      "Lending decision fairness testing",
      "Insurance underwriting equity monitoring",
      "ECOA and Fair Housing compliance",
      "Adverse action explanation generation",
    ],
  },
  contentguard: {
    name: "ContentGuard",
    tagline: "Media & Content AI Governance",
    description: "Content moderation, recommendation systems, and ad targeting fairness analysis. Build trust through algorithmic transparency.",
    icon: Tv,
    features: [
      "Content moderation bias detection",
      "Recommendation system fairness testing",
      "Ad targeting equity analysis",
      "Algorithmic transparency reporting",
      "User impact assessment tools",
    ],
  },
  enterprise: {
    name: "Enterprise AI Governance",
    tagline: "General AI Governance",
    description: "General-purpose AI governance for any business application. Custom frameworks for your organization's unique needs.",
    icon: Building2,
    features: [
      "Cross-domain AI auditing",
      "Custom compliance framework builder",
      "Enterprise-scale model inventory",
      "Multi-team collaboration",
      "Executive reporting dashboard",
    ],
  },
};

const ComingSoon = () => {
  const { productId } = useParams<{ productId: string }>();
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const product = products[productId as keyof typeof products];

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link to="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "You're on the list!",
      description: `We'll notify you when ${product.name} launches.`,
    });
    setEmail("");
  };

  const Icon = product.icon;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 py-24">
          <div className="container">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-warning"></span>
                  Coming Soon
                </div>

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <h1 className="mb-2 text-4xl font-bold text-foreground">{product.name}</h1>
                <p className="mb-4 text-xl text-primary">{product.tagline}</p>
                <p className="mb-8 text-lg text-muted-foreground">{product.description}</p>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Get Notified</CardTitle>
                    <CardDescription>
                      Be the first to know when {product.name} launches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleNotify} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Button type="submit">Notify Me</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>What to Expect</CardTitle>
                    <CardDescription>
                      Key features we're building for {product.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoon;
