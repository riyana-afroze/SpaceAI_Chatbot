"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase, type Conversation, type Message } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export function useConversations() {
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  // Load conversations when user is available
  useEffect(() => {
    if (user?.id) {
      loadConversations()
    }
  }, [user?.id])

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation?.id) {
      loadMessages(currentConversation.id)
    } else {
      setMessages([])
    }
  }, [currentConversation?.id])

  const loadConversations = async () => {
    if (!user?.id) {
      console.log('No user ID available')
      return
    }
    
    setLoading(true)
    try {
      console.log('Loading conversations for user:', user.id)
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Supabase error loading conversations:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }
      
      console.log('Successfully loaded conversations:', data)
      setConversations(data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
      // You could add a toast notification here
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const createConversation = async (title: string) => {
    if (!user?.id) {
      console.error('No user ID available for creating conversation')
      return null
    }

    console.log('Creating conversation with title:', title, 'for user:', user.id)

    try {
      const newConversation: Conversation = {
        id: uuidv4(),
        user_id: user.id,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log('Attempting to insert conversation:', newConversation)

      const { data, error } = await supabase
        .from('conversations')
        .insert([newConversation])
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('Successfully created conversation:', data)
      
      const conversation = data as Conversation
      setConversations(prev => [conversation, ...prev])
      setCurrentConversation(conversation)
      return conversation
    } catch (error) {
      console.error('Error creating conversation:', error)
      console.error('Full error object:', JSON.stringify(error, null, 2))
      return null
    }
  }

  const deleteConversation = async (conversationId: string) => {
    try {
      // Delete messages first
      await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId)

      // Delete conversation
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

      if (error) throw error

      setConversations(prev => prev.filter(c => c.id !== conversationId))
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const addMessage = async (content: string, role: 'user' | 'assistant', conversationId?: string, updateUI: boolean = true) => {
    const targetConversationId = conversationId || currentConversation?.id
    if (!targetConversationId) {
      console.error('No conversation ID provided for adding message')
      return null
    }

    try {
      const newMessage: Message = {
        id: uuidv4(),
        conversation_id: targetConversationId,
        content,
        role,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single()

      if (error) {
        console.error('Supabase error inserting message:', error)
        throw error
      }

      const message = data as Message
      
      // Only update UI state if requested (to prevent duplication with useChat)
      if (updateUI) {
        setMessages(prev => [...prev, message])
      }

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', targetConversationId)

      return message
    } catch (error) {
      console.error('Error adding message:', error)
      return null
    }
  }

  const updateConversationTitle = async (conversationId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', conversationId)

      if (error) throw error

      setConversations(prev => 
        prev.map(c => c.id === conversationId ? { ...c, title } : c)
      )

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => prev ? { ...prev, title } : null)
      }
    } catch (error) {
      console.error('Error updating conversation title:', error)
    }
  }

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    setCurrentConversation,
    createConversation,
    deleteConversation,
    addMessage,
    updateConversationTitle,
    loadConversations,
  }
}
