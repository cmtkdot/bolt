import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/callback/google'
);

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    // Get access token
    const { token } = await oauth2Client.getAccessToken();
    const accessToken = token;

    if (!accessToken) {
      throw new Error('Failed to get access token');
    }

    // Initialize Google Cloud Vision client
    const client = new ImageAnnotatorClient({
      authClient: oauth2Client as any, // Type assertion to avoid TypeScript error
    });

    // Perform OCR on the document
    const [result] = await client.documentTextDetection(Buffer.from(buffer));
    const fullTextAnnotation = result.fullTextAnnotation;

    if (!fullTextAnnotation) {
      throw new Error('No text found in the document');
    }

    const extractedText = fullTextAnnotation.text;

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
  }
}
