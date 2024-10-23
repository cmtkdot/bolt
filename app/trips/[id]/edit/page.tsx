'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useTrip } from '../../../../hooks/useTrip'
import EditTripForm from '../../../../components/trip/EditTripForm'

export default function EditTripPage() {
  const params = useParams()
  const tripId = params.id as string
  const { trip, isLoading, isError } = useTrip(tripId)

  if (isLoading) {
    return <div>Loading trip details...</div>
  }

  if (isError) {
    return <div>Error loading trip details. Please try again later.</div>
  }

  if (!trip) {
    return <div>No trip details found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Trip</h1>
      <EditTripForm trip={trip} />
    </div>
  )
}
