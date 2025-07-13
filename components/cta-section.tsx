import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Explore the Cosmos?</h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Join thousands of space enthusiasts, researchers, and engineers who trust Cosmos AI for their cosmic
          questions.
        </p>
        <Link href="/sign-up">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
