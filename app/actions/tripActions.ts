import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../lib/database.types';
import { Trip, NewHotel, Hotel } from '../../lib/database.types';

const supabase = createClientComponentClient<Database>();

// Existing trip-related functions
export async function createTrip(tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('trips')
    .insert(tripData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTrip(tripId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single();

  if (error) throw error;
  return data;
}

// New updateTrip function
export async function updateTrip(tripData: Trip) {
  const { data, error } = await supabase
    .from('trips')
    .update(tripData)
    .eq('id', tripData.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Add other existing trip-related functions here...

// New hotel-related functions
export async function addHotelToTrip(tripId: string, hotelData: NewHotel) {
  const { data, error } = await supabase
    .from('hotels')
    .insert({ ...hotelData, trip_id: tripId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getHotelsForTrip(tripId: string) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('trip_id', tripId);

  if (error) throw error;
  return data;
}

export async function updateHotel(hotelId: string, hotelData: Partial<Hotel>) {
  const { data, error } = await supabase
    .from('hotels')
    .update(hotelData)
    .eq('id', hotelId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHotel(hotelId: string) {
  const { error } = await supabase
    .from('hotels')
    .delete()
    .eq('id', hotelId);

  if (error) throw error;
}
