import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const tripId = searchParams.get('tripId')

  if (!tripId) {
    return NextResponse.json({ error: 'No trip ID provided' }, { status: 400 })
  }

  try {
    // Fetch trip details
    const { data: tripData, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single()

    if (tripError) {
      if (tripError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
      }
      throw tripError
    }

    // Fetch activities
    const { data: activitiesData, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (activitiesError) throw activitiesError

    return NextResponse.json({ trip: tripData, activities: activitiesData })
  } catch (error) {
    console.error('Error fetching trip data:', error)
    return NextResponse.json({ error: 'Failed to fetch trip data' }, { status: 500 })
  }
}
