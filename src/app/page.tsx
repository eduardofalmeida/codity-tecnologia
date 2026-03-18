import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HeroSection } from "@/components/sections/hero";
import { ProblemSection } from "@/components/sections/problem";
import { SolutionSection } from "@/components/sections/solution";
import { DifferentialSection } from "@/components/sections/differential";
import { DemoSection } from "@/components/sections/demo";
import { BenefitsSection } from "@/components/sections/benefits";
import { CtaSection } from "@/components/sections/cta";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <DifferentialSection />
      <DemoSection />
      <BenefitsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
