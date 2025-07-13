"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { Check, Zap, Rocket, Star } from "lucide-react"
import { useUser } from "@clerk/nextjs"

const plans = [
  {
    name: "Explorer",
    price: "Free",
    description: "Perfect for curious minds starting their cosmic journey",
    features: ["10 questions per day", "Basic space knowledge", "Community support", "Mobile access"],
    icon: Rocket,
    popular: false,
    priceId: null,
  },
  {
    name: "Astronaut",
    price: "$19",
    period: "/month",
    description: "For serious space enthusiasts and students",
    features: [
      "Unlimited questions",
      "Advanced astrophysics knowledge",
      "Priority support",
      "Export conversations",
      "Custom space calculations",
      "Research paper references",
    ],
    icon: Star,
    popular: true,
    priceId: "price_astronaut_monthly",
  },
  {
    name: "Mission Commander",
    price: "$49",
    period: "/month",
    description: "For professionals and researchers",
    features: [
      "Everything in Astronaut",
      "API access",
      "Custom AI training",
      "Team collaboration",
      "Advanced simulations",
      "Direct expert consultation",
      "White-label options",
    ],
    icon: Zap,
    popular: false,
    priceId: "price_commander_monthly",
  },
]

export function PricingSection() {
  const { user } = useUser()

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) return

    if (!user) {
      window.location.href = "/sign-in"
      return
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Mission</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Select the perfect plan for your space exploration journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <CardSpotlight key={index} className={`relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <Card className="bg-slate-900/50 border-slate-700 h-full">
                <CardHeader className="text-center">
                  <plan.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-slate-400">{plan.period}</span>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-300">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-6 ${
                      plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => handleSubscribe(plan.priceId)}
                  >
                    {plan.price === "Free" ? "Get Started" : "Subscribe Now"}
                  </Button>
                </CardContent>
              </Card>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  )
}
