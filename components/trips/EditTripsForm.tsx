import React from 'react';
import { useRouter } from 'next/navigation';
import { updateTrip } from '@/app/actions/tripActions.server';
import { Trip } from '@/lib/database.types';
import TripsForm from '@/components/trips/TripsForm';
import { useTrip } from '@/hooks/useTrips';

interface EditTripsFormProps {
  tripId: string;
}

const EditTripsForm: React.FC<EditTripsFormProps> = ({ tripId }) => {
  const router = useRouter();
  const { trip, isLoading, isError } = useTrip(tripId);

  if (isLoading) {
    return <div>Loading trip details...</div>;
  }

  if (isError) {
    return <div>Error loading trip details. Please try again later.</div>;
  }

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const handleSubmit = async (updatedTripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const updatedTrip = await updateTrip({ ...updatedTripData, id: tripId } as Trip);
      router.push(`/trips/${updatedTrip.id}`);
    } catch (error) {
      console.error('Failed to update trip:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return <TripsForm initialData={trip} onSubmit={handleSubmit} />;
};

export default EditTripsForm;
