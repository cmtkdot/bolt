import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { destination, tripType, duration } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful travel assistant that provides personalized travel tips."
        },
        {
          role: "user",
          content: `Generate 5 travel tips for a ${duration} trip to ${destination}. The trip type is ${tripType}. Provide tips on local customs, must-visit places, food recommendations, and any safety advice if necessary.`
        }
      ],
    });

    const tipsText = completion.choices[0].message.content;
    const tips = parseTips(tipsText);

    return NextResponse.json({ tips });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate travel tips' }, { status: 500 });
  }
}

function parseTips(text: string): { title: string; content: string }[] {
  const tipRegex = /(\d+\.\s*.*?):\s*([\s\S]*?)(?=\n\d+\.|\n*$)/g;
  const tips = [];
  let match;

  while ((match = tipRegex.exec(text)) !== null) {
    tips.push({
      title: match[1].trim(),
      content: match[2].trim()
    });
  }

  return tips;
}
