import { PricingSection } from "@/components/pricing-section"
import { StarField } from "@/components/star-field"
import Script from "next/script"

export default function PricingPage() {
  return (
    <div className="min-h-screen relative">
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      <StarField />
      <PricingSection />
    </div>
  )
}
