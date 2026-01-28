import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Tagline } from "@/components/landing/Tagline";
import { WhyParity } from "@/components/landing/WhyParity";
import { ProductSuite } from "@/components/landing/ProductSuite";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Tagline />
        <WhyParity />
        <ProductSuite />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
