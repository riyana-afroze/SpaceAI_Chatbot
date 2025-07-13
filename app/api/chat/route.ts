import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { currentUser } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    console.log("Received request body:", JSON.stringify(body, null, 2))
    
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages)
      return new Response("Invalid messages format", { status: 400 })
    }

    // Transform messages to OpenAI format if they have the 'parts' structure
    const transformedMessages = messages.map((message: any) => {
      if (message.parts && Array.isArray(message.parts)) {
        // Extract text content from parts structure
        const content = message.parts
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text)
          .join(" ")
        
        return {
          role: message.role,
          content: content || message.content
        }
      }
      
      // Return as-is if already in correct format
      return {
        role: message.role,
        content: message.content
      }
    })

    console.log("Transformed messages:", transformedMessages)

    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are Cosmos AI, an advanced AI assistant specializing in space, astrophysics, space engineering, and all cosmic phenomena. You have deep knowledge of:

- Astrophysics and cosmology
- Space engineering and rocket science  
- Planetary science and astronomy
- Space missions and exploration
- Theoretical physics related to space
- Space technology and instrumentation
- Orbital mechanics and spacecraft design

Provide detailed, accurate, and engaging responses about space-related topics. Use scientific terminology appropriately but explain complex concepts clearly. When discussing cutting-edge research, mention if something is theoretical or still being studied.

Always maintain enthusiasm for space exploration and discovery while being scientifically rigorous.`,
      messages: transformedMessages,
    })

    console.log("StreamText result created successfully")
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
