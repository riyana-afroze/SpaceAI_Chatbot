import { EnvironmentTest } from "@/components/environment-test"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      
      {/* Real-time environment test */}
      <div className="mb-8">
        <EnvironmentTest />
      </div>

      <div className="space-y-2">
        <p>
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"}
        </p>
        <p>CLERK_SECRET_KEY: {process.env.CLERK_SECRET_KEY ? "✅ Set" : "❌ Missing"}</p>
        <p>OPENAI_API_KEY: {process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing"}</p>
        <p>
          NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
        </p>
        <p>
          NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
        </p>
        <p>STRIPE_SECRET_KEY: {process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing"}</p>
        <p>
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"}
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Clerk Key Preview:</h2>
        <p className="font-mono text-sm bg-slate-800 p-2 rounded">
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            ? `${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20)}...`
            : "Not found"}
        </p>
      </div>
    </div>
  )
}
