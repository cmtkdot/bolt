import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const { fileUrl, type } = await req.json();

  if (!fileUrl || !type) {
    return NextResponse.json({ message: 'Missing fileUrl or type' }, { status: 400 });
  }

  try {
    // This is a placeholder for the AI service API call
    // Replace this with your actual AI service integration
    const aiServiceResponse = await axios.post('https://your-ai-service-url.com/process-pdf', {
      fileUrl,
      type
    });

    // The AI service should return the extracted data
    const extractedData = aiServiceResponse.data;

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ message: 'Error processing PDF' }, { status: 500 });
  }
}
