import { SignUp } from "@clerk/nextjs"
import { CardSpotlight } from "@/components/ui/card-spotlight"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-black">
      <CardSpotlight className="p-8 rounded-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Join Cosmos AI</h1>
          <p className="text-slate-400">Create your account to start your cosmic journey</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              card: "bg-transparent shadow-none",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "border-slate-600 text-white hover:bg-slate-800",
              formFieldInput: "bg-slate-800 border-slate-600 text-white",
              formFieldLabel: "text-slate-300",
              footerActionLink: "text-blue-400 hover:text-blue-300",
            },
          }}
        />
      </CardSpotlight>
    </div>
  )
}
