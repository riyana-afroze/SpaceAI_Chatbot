"use client"

import type React from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MovingBorder } from "@/components/ui/moving-border"
import { MarkdownContent } from "@/components/markdown-content"
import { UserButton } from "@clerk/nextjs"
import { Send, Rocket, User, Bot, Plus, MessageSquare, Trash2, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useConversations } from "@/hooks/use-conversations"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function ChatInterface() {
  const [hasStarted, setHasStarted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  
  const {
    conversations,
    currentConversation,
    messages: conversationMessages,
    createConversation,
    deleteConversation,
    addMessage,
    setCurrentConversation,
    updateConversationTitle,
  } = useConversations()

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onFinish: async (message) => {
      // Save assistant message to database using the active conversation ID
      const conversationId = activeConversationId || currentConversation?.id
      if (conversationId) {
        await addMessage(message.content, 'assistant', conversationId)
        setActiveConversationId(null) // Clear after use
      }
    },
  })

  // Sync conversation messages with AI chat messages
  useEffect(() => {
    if (conversationMessages.length > 0) {
      setMessages(conversationMessages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      })))
    } else {
      setMessages([])
    }
  }, [conversationMessages, setMessages])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!input.trim() || isLoading) return

    let conversation = currentConversation

    // Create new conversation if none exists
    if (!conversation) {
      const title = input.slice(0, 50) + (input.length > 50 ? '...' : '')
      conversation = await createConversation(title)
      if (!conversation) return
    }

    // Store conversation ID for the onFinish callback
    setActiveConversationId(conversation.id)

    // Save user message to database
    await addMessage(input, 'user', conversation.id)

    if (!hasStarted) setHasStarted(true)
    
    // Submit to AI API
    handleSubmit(e)

    // Update conversation title if it's the first message
    if (messages.length === 0 && input.length <= 50) {
      await updateConversationTitle(conversation.id, input)
    }
  }

  const startNewConversation = async () => {
    setCurrentConversation(null)
    setMessages([])
    setHasStarted(false)
    setSidebarOpen(false)
    setActiveConversationId(null) // Clear any pending conversation ID
  }

  const selectConversation = (conversation: any) => {
    setCurrentConversation(conversation)
    setHasStarted(true)
    setSidebarOpen(false)
    setActiveConversationId(null) // Clear any pending conversation ID
  }

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteConversation(conversationId)
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <Button
              onClick={startNewConversation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                  currentConversation?.id === conversation.id
                    ? "bg-blue-600/20 border border-blue-600/50"
                    : "hover:bg-slate-800"
                )}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
                  <span className="text-sm text-white truncate">
                    {conversation.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteConversation(conversation.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1 h-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No conversations yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white mr-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Rocket className="w-8 h-8 text-blue-400" />
              <div>
                <Link href="/">
                  <h1 className="text-2xl font-bold text-white hover:text-blue-300 transition-colors cursor-pointer">Cosmos AI</h1>
                </Link>
                {currentConversation && (
                  <p className="text-sm text-slate-400 truncate max-w-xs">
                    {currentConversation.title}
                  </p>
                )}
              </div>
            </div>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Cosmos AI</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Ask me anything about astrophysics, space engineering, cosmic phenomena, or space exploration. I'm here to
                help you navigate the universe of knowledge!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <Card
                    className={`max-w-3xl p-4 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-800 border-slate-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-white">{message.content}</div>
                    ) : (
                      <MarkdownContent content={message.content} />
                    )}
                  </Card>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <Card className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={onSubmit} className="flex space-x-4">
              {!hasStarted ? (
                <MovingBorder className="flex-1 rounded-lg p-[1px]">
                  <div className="bg-slate-900 rounded-lg">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask me about black holes, rocket propulsion, exoplanets, or any cosmic mystery..."
                      className="border-0 bg-transparent text-white placeholder-slate-400 focus:ring-0 text-lg py-6"
                      disabled={isLoading}
                    />
                  </div>
                </MovingBorder>
              ) : (
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Continue your cosmic exploration..."
                  className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400 text-lg py-6"
                  disabled={isLoading}
                />
              )}
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
