import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { currentUser } from "@clerk/nextjs/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages } = await req.json()

    const result = streamText({
      model: openai("gpt-4-turbo"),
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
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
