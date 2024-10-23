import useSWR from 'swr';
import { Database } from '../lib/database.types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type Itinerary = Database['public']['Tables']['itineraries']['Row'];

async function getItineraries(tripId: string): Promise<Itinerary[]> {
  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export function useItineraries(tripId: string) {
  const { data, error, isLoading, mutate } = useSWR<Itinerary[]>(
    tripId ? `/api/itineraries/${tripId}` : null,
    () => getItineraries(tripId)
  );

  return {
    itineraries: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
