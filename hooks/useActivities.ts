import useSWR from 'swr';
import { Database } from '../lib/database.types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type Activity = Database['public']['Tables']['activities']['Row'];

async function getActivities(tripId: string): Promise<Activity[]> {
  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('trip_id', tripId)
    .order('date', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export function useActivities(tripId: string) {
  const { data, error, isLoading, mutate } = useSWR<Activity[]>(
    tripId ? `/api/activities/${tripId}` : null,
    () => getActivities(tripId)
  );

  return {
    activities: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
