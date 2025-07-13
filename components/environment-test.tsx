"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

export function EnvironmentTest() {
  const { user } = useUser()
  const [status, setStatus] = useState({
    supabase: 'checking...',
    clerk: 'checking...',
    openai: 'checking...',
  })

  useEffect(() => {
    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase.from('conversations').select('count').limit(1)
        if (error) throw error
        setStatus(prev => ({ ...prev, supabase: '✅ Connected' }))
      } catch (error) {
        console.error('Supabase test failed:', error)
        setStatus(prev => ({ ...prev, supabase: '❌ Failed' }))
      }
    }

    // Test OpenAI (we'll just check if the endpoint exists)
    const testOpenAI = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [] })
        })
        if (response.status === 401) {
          // Expected if not signed in
          setStatus(prev => ({ ...prev, openai: '✅ API available' }))
        } else if (response.ok) {
          setStatus(prev => ({ ...prev, openai: '✅ Connected' }))
        } else {
          setStatus(prev => ({ ...prev, openai: '❌ Error' }))
        }
      } catch (error) {
        console.error('OpenAI test failed:', error)
        setStatus(prev => ({ ...prev, openai: '❌ Failed' }))
      }
    }

    testSupabase()
    testOpenAI()
  }, [])

  useEffect(() => {
    // Test Clerk
    if (user) {
      setStatus(prev => ({ ...prev, clerk: '✅ Authenticated' }))
    } else {
      setStatus(prev => ({ ...prev, clerk: '⚠️ Not signed in' }))
    }
  }, [user])

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-3">Environment Status</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-300">Supabase:</span>
          <span className="text-white">{status.supabase}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Clerk Auth:</span>
          <span className="text-white">{status.clerk}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">OpenAI API:</span>
          <span className="text-white">{status.openai}</span>
        </div>
      </div>
      {user && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-400">
            Signed in as: {user.emailAddresses[0]?.emailAddress || 'Unknown'}
          </p>
        </div>
      )}
    </div>
  )
}
