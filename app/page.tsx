import { Header } from "@/components/header"
import { SiteBackground } from "@/components/site-background"
import { HeroSection } from "@/components/hero-section"
import { LogoCloud } from "@/components/logo-cloud"
import { WhyRay } from "@/components/why-ray"
import { RequirementsFlow } from "@/components/requirements-flow"
import { DemandEngine } from "@/components/demand-engine"
import { Pricing } from "@/components/pricing"
import { Testimonials } from "@/components/testimonials"
import { Comparison } from "@/components/comparison"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <SiteBackground />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <LogoCloud />
        <WhyRay />
        <RequirementsFlow />
        <DemandEngine />
        <Testimonials />
        <Comparison />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
