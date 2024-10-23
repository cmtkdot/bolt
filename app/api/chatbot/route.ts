import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { message } = await req.json();

    if (!message) {
        return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ message: 'Claude API key is not configured' }, { status: 500 });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({
                model: 'claude-2.1',
                messages: [{ role: 'user', content: message }],
                max_tokens_to_sample: 300,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get response from Claude API');
        }

        const data = await response.json();
        return NextResponse.json({ message: data.content[0].text });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
