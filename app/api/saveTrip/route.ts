import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { name, start_date, end_date, destination } = await request.json()

    // Here you would typically use a geocoding service to get lat/lng
    // For this example, we'll use placeholder values
    const latitude = 0
    const longitude = 0

    const { data, error } = await supabase
      .from('trips')
      .insert([
        { 
          name, 
          start_date, 
          end_date,
          destination,
          latitude,
          longitude
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ message: 'Trip saved successfully', data })
  } catch (error) {
    console.error('Error saving trip:', error)
    return NextResponse.json({ error: 'Error saving trip', details: error }, { status: 500 })
  }
}
