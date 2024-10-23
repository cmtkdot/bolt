import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { TripDetails } from '@/components/trip-details'
import { supabase } from '@/lib/supabase'

async function getTrip(id: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching trip:', error)
    return null
  }

  return data
}

export default async function TripPage({ params }: { params: { id: string } }) {
  const trip = await getTrip(params.id)

  if (!trip) {
    notFound()
  }

  const handleUpdateTrip = async (updatedTrip: any) => {
    // Implement trip update logic here
    console.log('Updating trip:', updatedTrip)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <TripDetails trip={trip} onUpdateTrip={handleUpdateTrip} />
      </Suspense>
    </div>
  )
}
