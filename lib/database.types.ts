export interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
  time_zone: string;
  is_public: boolean;
  itinerary: any[];
  latitude: number | null;
  longitude: number | null;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  trip_id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  price?: number;
  created_at: string;
  updated_at: string;
  itinerary_id: string | null;
  order: number;
}

export interface PackingItem {
  id: string;
  trip_id: string;
  item_name: string;
  is_packed: boolean;
  quantity: number;
}

export interface Hotel {
  id: string;
  trip_id: string;
  name: string;
  address: string;
  check_in_date: string;
  check_out_date: string;
  price: number;
  currency: string;
  booking_confirmation: string | null;
  notes: string | null;
}

export type NewHotel = Omit<Hotel, 'id'>;

export interface Expense {
  id: string;
  trip_id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  category: string;
}

export interface Database {
  public: {
    Tables: {
      trips: {
        Row: Trip;
        Insert: Omit<Trip, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Trip, 'id' | 'created_at' | 'updated_at'>>;
      };
      activities: {
        Row: Activity;
        Insert: Omit<Activity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Activity, 'id' | 'created_at' | 'updated_at'>>;
      };
      packing_items: {
        Row: PackingItem;
        Insert: Omit<PackingItem, 'id'>;
        Update: Partial<Omit<PackingItem, 'id'>>;
      };
      hotels: {
        Row: Hotel;
        Insert: NewHotel;
        Update: Partial<NewHotel>;
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, 'id'>;
        Update: Partial<Omit<Expense, 'id'>>;
      };
    };
  };
}
