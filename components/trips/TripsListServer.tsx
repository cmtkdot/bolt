import React, { Suspense } from 'react'
import { getTrips } from '../../app/actions/tripActions.server'
import TripList from './TripList'

function TripListFallback() {
  return <div>Loading trips...</div>
}

async function TripListContent({ onTripSelect }: { onTripSelect: (tripId: string) => void }) {
  const trips = await getTrips()
  return <TripList initialTrips={trips} onTripSelect={onTripSelect} />
}

export default function TripListServer({ onTripSelect }: { onTripSelect: (tripId: string) => void }) {
  return (
    <Suspense fallback={<TripListFallback />}>
      <TripListContent onTripSelect={onTripSelect} />
    </Suspense>
  )
}
