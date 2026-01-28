import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProductSuite } from "@/components/landing/ProductSuite";
import { ComplianceFrameworks } from "@/components/landing/ComplianceFrameworks";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProductSuite />
        <ComplianceFrameworks />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
