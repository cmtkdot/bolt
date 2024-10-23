import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const { destination, interests } = await request.json()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful travel assistant that recommends activities based on the destination and interests provided."
        },
        {
          role: "user",
          content: `Recommend 5 activities for ${destination} based on these interests: ${interests.join(', ')}`
        }
      ],
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('No recommendations generated')
    }

    const recommendations = content
      .split('\n')
      .filter(item => item.trim() !== '')
      .map(item => item.replace(/^\d+\.\s*/, '').trim())

    if (recommendations.length === 0) {
      throw new Error('No valid recommendations generated')
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}
