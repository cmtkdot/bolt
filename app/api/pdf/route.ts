import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const tripId = formData.get('tripId') as string
  const type = formData.get('type') as 'flight' | 'hotel' | 'itinerary'

  if (!file || !tripId || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // 1. Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(`${tripId}/${type}/${file.name}`, file)

    if (uploadError) throw uploadError

    // 2. Get public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(uploadData.path)

    // 3. Process the PDF with Google AI
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const fileContent = await file.text() // Convert PDF to text (you might need a PDF parsing library for better results)
    const prompt = `Analyze this ${type} document and extract key information. For a flight, extract departure and arrival times, airports, airline, and flight number. For a hotel, extract check-in and check-out dates, hotel name, and address. For an itinerary, extract activities, dates, and times. Format the response as a JSON object.`
    const result = await model.generateContent([prompt, fileContent])
    const processedData = JSON.parse(result.response.text())

    // 4. Update the database based on the type
    let dbUpdateResult
    switch (type) {
      case 'flight':
        dbUpdateResult = await supabase.from('flights').insert({
          trip_id: tripId,
          ...processedData,
          document_url: publicUrl
        })
        break
      case 'hotel':
        dbUpdateResult = await supabase.from('accommodations').insert({
          trip_id: tripId,
          ...processedData,
          document_url: publicUrl
        })
        break
      case 'itinerary':
        // For itinerary, we might want to create multiple activities
        if (Array.isArray(processedData.activities)) {
          dbUpdateResult = await supabase.from('activities').insert(
            processedData.activities.map((activity: any) => ({
              trip_id: tripId,
              ...activity,
              document_url: publicUrl
            }))
          )
        } else {
          dbUpdateResult = await supabase.from('activities').insert({
            trip_id: tripId,
            ...processedData,
            document_url: publicUrl
          })
        }
        break
    }

    if (dbUpdateResult.error) throw dbUpdateResult.error

    return NextResponse.json({ success: true, data: processedData })
  } catch (error) {
    console.error('Error processing PDF:', error)
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 })
  }
}
