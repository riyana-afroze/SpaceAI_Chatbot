import { EnvironmentTest } from "@/components/environment-test"
import { DatabaseTest } from "@/components/database-test"
import { SupabaseSetup } from "@/components/supabase-setup"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Setup & Debug</h1>
      
      {/* Supabase Setup */}
      <div className="mb-8">
        <SupabaseSetup />
      </div>
      
      {/* Environment variables test */}
      <div className="mb-8">
        <EnvironmentTest />
      </div>

      {/* Database connection test */}
      <div className="mb-8">
        <DatabaseTest />
      </div>

      {/* Static environment check */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Static Environment Check</h3>
        <div className="space-y-2 text-sm">
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
      </div>
    </div>
  )
}
