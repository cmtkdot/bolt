import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful travel assistant. Provide concise and informative responses to travel-related questions." },
        { role: "user", content: message }
      ],
      max_tokens: 150
    })

    const aiMessage = completion.choices[0].message.content

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 })
  }
}