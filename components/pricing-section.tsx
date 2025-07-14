"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { Check, Zap, Rocket, Star } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

const plans = [
  {
    id: "explorer",
    name: "Explorer",
    price: "Free",
    description: "Perfect for curious minds starting their cosmic journey",
    features: ["10 questions per day", "Basic space knowledge", "Community support", "Mobile access"],
    icon: Rocket,
    popular: false,
    priceId: null,
  },
  {
    id: "astronaut",
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
    priceId: "price_1QTBKmAD73D0UdfpMYqDqgRB", // Test price ID - replace with your actual Stripe price ID
  },
  {
    id: "commander",
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
    priceId: "price_1QTBLcAD73D0UdfpT8xTWKnP", // Test price ID - replace with your actual Stripe price ID
  },
]

export function PricingSection() {
  const { user } = useUser()
  const [currentPlan, setCurrentPlan] = useState<string>("explorer")
  const [isLoading, setIsLoading] = useState<string | null>(null)

  // Get user's current plan from Clerk metadata or default to "explorer" (free)
  useEffect(() => {
    if (user?.publicMetadata?.plan) {
      setCurrentPlan(user.publicMetadata.plan as string)
    } else {
      setCurrentPlan("explorer") // Default to free plan
    }
  }, [user])

  const handleSubscribe = async (priceId: string | null, planId: string) => {
    if (!priceId) return

    if (!user) {
      window.location.href = "/sign-in"
      return
    }

    // Don't allow subscribing to current plan
    if (planId === currentPlan) return

    setIsLoading(planId)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          priceId,
          userId: user.id,
          planId
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      if (!stripe) {
        throw new Error("Stripe not loaded")
      }
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to start checkout process. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  const getButtonText = (plan: any) => {
    if (plan.id === currentPlan) {
      return "Current Plan"
    }
    return plan.price === "Free" ? "Get Started" : "Subscribe Now"
  }

  const isCurrentPlan = (planId: string) => planId === currentPlan

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
            <CardSpotlight 
              key={index} 
              className={`relative ${
                isCurrentPlan(plan.id) 
                  ? "ring-2 ring-blue-500" 
                  : plan.popular 
                    ? "ring-2 ring-blue-500/50" 
                    : ""
              }`}
            >
              {plan.popular && !isCurrentPlan(plan.id) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
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
                      isCurrentPlan(plan.id)
                        ? "bg-green-600 hover:bg-green-600 cursor-default"
                        : plan.popular 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => handleSubscribe(plan.priceId, plan.id)}
                    disabled={isCurrentPlan(plan.id) || isLoading === plan.id}
                  >
                    {isLoading === plan.id ? "Processing..." : getButtonText(plan)}
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
