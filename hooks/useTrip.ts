import useSWR from 'swr';
import { Database } from '../lib/database.types';
import { getTrip } from '../app/actions/tripActions';

type Trip = Database['public']['Tables']['trips']['Row'];

export function useTrip(tripId: string) {
  const { data, error, isLoading, mutate } = useSWR<Trip | null>(
    tripId ? `/api/trips/${tripId}` : null,
    () => getTrip(tripId)
  );

  return {
    trip: data,
    isLoading,
    isError: error,
    mutate,
  };
}
