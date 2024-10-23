import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Trip } from '@/lib/database.types'

export async function getTrips(): Promise<Trip[]> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching trips:', error)
    throw new Error('Failed to fetch trips')
  }

  return data || []
}
