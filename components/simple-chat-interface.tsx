"use client"

import type React from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MovingBorder } from "@/components/ui/moving-border"
import { MarkdownContent } from "@/components/markdown-content"
import { UserButton } from "@clerk/nextjs"
import { Send, Rocket, User, Bot } from "lucide-react"
import { useState, useEffect } from "react"

export function SimpleChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })
  const [hasStarted, setHasStarted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasStarted) setHasStarted(true)
    handleSubmit(e)
  }

  // Show loading state until component is mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Rocket className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Cosmos AI</h1>
                <p className="text-sm text-slate-400">Simple Chat Mode</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Rocket className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Cosmos AI</h1>
              <p className="text-sm text-slate-400">Simple Chat Mode</p>
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
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-300 text-sm">
                <strong>Note:</strong> Running in simple mode. Set up Supabase to enable conversation history.
              </p>
            </div>
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
  )
}
