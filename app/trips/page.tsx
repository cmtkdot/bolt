'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import TripList, { TripListProps } from "@/components/trip/TripList"

export default function TripsPage() {
  const router = useRouter()

  const handleTripSelect: TripListProps['onTripSelect'] = (tripId) => {
    router.push(`/trips/${tripId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>
      <Button onClick={() => router.push('/trips/new')} className="mb-6">Create New Trip</Button>
      <TripList onTripSelect={handleTripSelect} />
    </div>
  )
}
