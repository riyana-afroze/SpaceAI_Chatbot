"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'

export function SupabaseSetup() {
  const { user } = useUser()
  const [setupStatus, setSetupStatus] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    setSetupStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const setupDatabase = async () => {
    setIsLoading(true)
    setSetupStatus([])
    
    try {
      addLog('🚀 Starting Supabase database setup...')
      
      // Test connection first
      addLog('Testing Supabase connection...')
      const { data: testData, error: testError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1)
      
      if (testError) {
        addLog(`❌ Connection failed: ${testError.message}`)
        return
      }
      
      addLog('✅ Connection successful')
      
      // Create conversations table
      addLog('Creating conversations table...')
      const { error: convError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS conversations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
      
      if (convError) {
        addLog(`❌ Failed to create conversations table: ${convError.message}`)
        // Try alternative approach
        addLog('Trying alternative table creation...')
        const { error: altError } = await supabase
          .from('conversations')
          .select('id')
          .limit(1)
          
        if (altError && altError.code === '42P01') {
          addLog('❌ Tables do not exist. You need to run the SQL manually in Supabase.')
          addLog('📋 Go to your Supabase dashboard and run the SQL from database-setup.sql')
          return
        }
      } else {
        addLog('✅ Conversations table created')
      }
      
      // Create messages table
      addLog('Creating messages table...')
      const { error: msgError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
      
      if (msgError) {
        addLog(`❌ Failed to create messages table: ${msgError.message}`)
      } else {
        addLog('✅ Messages table created')
      }
      
      // Test table access
      addLog('Testing table access...')
      const { data: convData, error: convAccessError } = await supabase
        .from('conversations')
        .select('count')
        .limit(1)
      
      if (convAccessError) {
        addLog(`❌ Cannot access conversations table: ${convAccessError.message}`)
        if (convAccessError.code === '42501') {
          addLog('🔒 RLS policies may be blocking access. Setting up policies...')
        }
      } else {
        addLog('✅ Can access conversations table')
      }
      
      // Test inserting a conversation
      if (user?.id) {
        addLog('Testing conversation creation...')
        const testConv = {
          id: crypto.randomUUID(),
          user_id: user.id,
          title: 'Test Setup Conversation',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        const { data: insertData, error: insertError } = await supabase
          .from('conversations')
          .insert([testConv])
          .select()
          .single()
        
        if (insertError) {
          addLog(`❌ Test insert failed: ${insertError.message}`)
          addLog(`Error code: ${insertError.code}`)
          
          if (insertError.code === '23505') {
            addLog('🔄 Unique constraint violation - this is normal for testing')
          } else if (insertError.code === '42501') {
            addLog('🔒 RLS policy blocking insert. You need to set up RLS policies.')
          }
        } else {
          addLog('✅ Test conversation created successfully!')
          
          // Clean up test data
          await supabase.from('conversations').delete().eq('id', testConv.id)
          addLog('🧹 Test data cleaned up')
        }
      }
      
      addLog('🎉 Database setup complete!')
      
    } catch (error) {
      addLog(`❌ Setup failed: ${error}`)
      console.error('Database setup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Supabase Database Setup</h3>
      
      <div className="mb-4">
        <Button 
          onClick={setupDatabase} 
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Setting up...' : '🚀 Setup Supabase Database'}
        </Button>
      </div>
      
      <div className="bg-slate-900 p-4 rounded max-h-96 overflow-y-auto">
        {setupStatus.length === 0 ? (
          <p className="text-slate-400 text-sm">Click the setup button to configure your database</p>
        ) : (
          <div className="space-y-1">
            {setupStatus.map((status, index) => (
              <p key={index} className="text-sm font-mono text-slate-300">
                {status}
              </p>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded">
        <h4 className="text-blue-300 font-medium mb-2">Manual Setup (Recommended)</h4>
        <p className="text-blue-200 text-sm mb-2">
          If automatic setup fails, go to your Supabase dashboard:
        </p>
        <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
          <li>Open <a href="https://supabase.com/dashboard/project/dfubyvplzppqhjbetquh" target="_blank" className="underline">your Supabase project</a></li>
          <li>Go to SQL Editor</li>
          <li>Copy the SQL from <code>database-setup.sql</code></li>
          <li>Run it in the SQL Editor</li>
          <li>Refresh this page and test again</li>
        </ol>
      </div>
    </div>
  )
}
