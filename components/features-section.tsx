import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Telescope, Atom, Satellite, Zap } from "lucide-react"

const features = [
  {
    icon: Telescope,
    title: "Astrophysics Expertise",
    description:
      "Deep knowledge of stellar evolution, cosmology, black holes, and the fundamental physics of the universe.",
  },
  {
    icon: Satellite,
    title: "Space Engineering",
    description: "Comprehensive understanding of spacecraft design, orbital mechanics, and space mission planning.",
  },
  {
    icon: Atom,
    title: "Theoretical Physics",
    description: "Explore quantum mechanics, relativity, and cutting-edge theories about space and time.",
  },
  {
    icon: Zap,
    title: "Real-time Insights",
    description: "Get instant answers to complex space-related questions with detailed explanations.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore the Universe of Knowledge</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Powered by advanced AI, trained on the latest space research and cosmic discoveries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-colors">
              <CardHeader className="text-center">
                <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 text-center">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
