import React from 'react'
import { TripProvider } from '@/contexts/TripContext'
import TripDetails from '@/components/trip/TripDetails'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function TripPage({ params }: { params: { id: string } }) {
  return (
    <ErrorBoundary>
      <TripProvider tripId={params.id}>
        <TripDetails tripId={params.id} />
      </TripProvider>
    </ErrorBoundary>
  )
}
