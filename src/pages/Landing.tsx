import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { KeyStats } from "@/components/landing/KeyStats";
import { RegulatoryRadarShowcase } from "@/components/landing/RegulatoryRadarShowcase";
import { Tagline } from "@/components/landing/Tagline";
import { WhyParity } from "@/components/landing/WhyParity";
import { PublicSector } from "@/components/landing/PublicSector";
import { TransparencyTools } from "@/components/landing/TransparencyTools";
import { ProductSuite } from "@/components/landing/ProductSuite";
import { Integrations } from "@/components/landing/Integrations";
import { ComplianceFrameworks } from "@/components/landing/ComplianceFrameworks";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <KeyStats />
        <RegulatoryRadarShowcase />
        <Tagline />
        <WhyParity />
        <PublicSector />
        <TransparencyTools />
        <ProductSuite />
        <Integrations />
        <ComplianceFrameworks />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
