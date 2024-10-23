import useSWR from 'swr'
import { supabase } from '../lib/supabase-client'
import { Trip } from '../lib/database.types'

export function useTrips() {
  const fetcher = async (): Promise<Trip[]> => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) {
      throw error
    }

    return data
  }

  const { data, error, isLoading, mutate } = useSWR<Trip[]>('trips', fetcher)

  return {
    trips: data,
    isLoading,
    isError: error,
    mutate
  }
}
