import React from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import TripCard from './TripCard'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

const fetcher = async (url: string) => {
  const supabase = createClientComponentClient()
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: true })

  if (error) throw error
  return data
}

export default function TripsList() {
  const { data: trips, error, isLoading } = useSWR('/api/trips', fetcher)

  if (isLoading) {
    return <div className="flex justify-center"><Loader className="h-8 w-8 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center">Error loading trips. Please try again later.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips && trips.map((trip: any) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
      <Link href="/trips/new">
        <Button className="w-full h-full flex items-center justify-center">
          + Add New Trip
        </Button>
      </Link>
    </div>
  )
}