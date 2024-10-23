import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { destination, interests } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful travel assistant that provides activity recommendations based on destinations and interests."
        },
        {
          role: "user",
          content: `Provide 5 activity recommendations for ${destination} based on these interests: ${interests.join(', ')}.`
        }
      ],
    })

    const message = completion.choices[0]?.message

    if (!message || !message.content) {
      throw new Error('No recommendations received from OpenAI')
    }

    const recommendations = message.content
      .split('\n')
      .filter(item => item.trim() !== '')
      .map(item => ({ name: item.replace(/^\d+\.\s*/, '') }))

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}
