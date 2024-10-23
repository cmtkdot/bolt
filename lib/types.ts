export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  itinerary: Json;
  latitude: number | null;
  longitude: number | null;
  location: string;
  total_budget: number;
  currency: string;
  time_zone: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  trip_id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  price: number;
  created_at: string;
  updated_at: string;
  itinerary_id: string | null;
  order: number;
}

export interface Hotel {
  id: string;
  trip_id: string;
  name: string;
  address: string;
  check_in_date: string;
  check_out_date: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  trip_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PackingItem {
  id: number;
  trip_id: string;
  item_name: string;
  is_packed: boolean;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export type NewTrip = Omit<Trip, 'id' | 'created_at' | 'updated_at'>;
export type NewActivity = Omit<Activity, 'id' | 'created_at' | 'updated_at'>;
export type NewHotel = Omit<Hotel, 'id' | 'created_at' | 'updated_at'>;
export type NewItinerary = Omit<Itinerary, 'id' | 'created_at' | 'updated_at'>;
export type NewProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type NewPackingItem = Omit<PackingItem, 'id' | 'created_at' | 'updated_at'>;
