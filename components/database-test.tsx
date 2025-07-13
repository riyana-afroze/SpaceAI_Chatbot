"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function DatabaseTest() {
  const { user } = useUser()
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setIsLoading(true)
    setTestResults([])
    
    try {
      // Test 1: Basic connection
      addLog('Testing Supabase connection...')
      const { data, error } = await supabase.from('conversations').select('count').limit(1)
      
      if (error) {
        addLog(`❌ Connection failed: ${error.message}`)
        addLog(`Error code: ${error.code}`)
        addLog(`Error details: ${error.details}`)
        addLog(`Error hint: ${error.hint}`)
        return
      }
      
      addLog('✅ Basic connection successful')
      
      // Test 2: Check if tables exist
      addLog('Checking if tables exist...')
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .in('table_name', ['conversations', 'messages'])
      
      if (tableError) {
        addLog(`❌ Could not check tables: ${tableError.message}`)
      } else {
        addLog(`✅ Found ${tables?.length || 0} tables`)
        tables?.forEach(table => addLog(`  - ${table.table_name}`))
      }
      
      // Test 3: Check user authentication
      if (!user?.id) {
        addLog('❌ User not authenticated')
        return
      }
      
      addLog(`✅ User authenticated: ${user.id}`)
      
      // Test 4: Try to insert a test conversation
      addLog('Testing conversation creation...')
      const testConv = {
        id: crypto.randomUUID(),
        user_id: user.id,
        title: 'Test Conversation',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('conversations')
        .insert([testConv])
        .select()
        .single()
      
      if (insertError) {
        addLog(`❌ Insert failed: ${insertError.message}`)
        addLog(`Error code: ${insertError.code}`)
        addLog(`Error details: ${insertError.details}`)
        
        // Check RLS policies
        addLog('Checking RLS policies...')
        const { data: policies, error: policyError } = await supabase
          .from('pg_policies')
          .select('*')
          .eq('tablename', 'conversations')
        
        if (policyError) {
          addLog(`❌ Could not check policies: ${policyError.message}`)
        } else {
          addLog(`Found ${policies?.length || 0} policies for conversations table`)
        }
      } else {
        addLog('✅ Test conversation created successfully')
        
        // Clean up - delete the test conversation
        await supabase.from('conversations').delete().eq('id', testConv.id)
        addLog('✅ Test conversation cleaned up')
      }
      
    } catch (error) {
      addLog(`❌ Unexpected error: ${error}`)
      console.error('Database test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Database Connection Test</h3>
      
      <Button 
        onClick={testConnection} 
        disabled={isLoading}
        className="mb-4 bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? 'Testing...' : 'Run Database Test'}
      </Button>
      
      <div className="bg-slate-900 p-4 rounded max-h-96 overflow-y-auto">
        {testResults.length === 0 ? (
          <p className="text-slate-400 text-sm">Click "Run Database Test" to check your setup</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <p key={index} className="text-sm font-mono text-slate-300">
                {result}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
