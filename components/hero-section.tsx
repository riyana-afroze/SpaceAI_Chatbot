import { Button } from "@/components/ui/button"
import { Rocket, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/images/earth-hero.png" alt="Earth from space" fill className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center mb-6">
          <Rocket className="w-12 h-12 text-blue-400 mr-4" />
          <Link href="/">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer">
              COSMOS AI
            </h1>
          </Link>
        </div>

        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Your advanced AI companion for exploring the mysteries of space, astrophysics, and cosmic engineering
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/chat">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-white hover:bg-slate-800 px-8 py-4 text-lg bg-transparent"
            >
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
