import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const tripId = searchParams.get('tripId')

  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('trip_id', tripId)

    if (error) throw error

    return NextResponse.json({ activities: data })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
