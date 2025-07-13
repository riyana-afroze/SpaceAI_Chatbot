"use client"

import { ChatInterface } from "@/components/chat-interface"
import { SimpleChatInterface } from "@/components/simple-chat-interface"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ChatPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [useSimpleMode, setUseSimpleMode] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  // Test if Supabase is working
  useEffect(() => {
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('count')
          .limit(1)
        
        if (!error) {
          setUseSimpleMode(false) // Database is working, use full interface
        }
      } catch (error) {
        console.log('Using simple mode - database not ready:', error)
        setUseSimpleMode(true)
      }
    }

    if (isSignedIn) {
      testSupabase()
    }
  }, [isSignedIn])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      {useSimpleMode ? <SimpleChatInterface /> : <ChatInterface />}
    </div>
  )
}
