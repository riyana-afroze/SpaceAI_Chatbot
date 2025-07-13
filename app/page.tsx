import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CTASection } from "@/components/cta-section"
import { StarField } from "@/components/star-field"

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <StarField />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}
