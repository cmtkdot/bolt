'use client'

import React, { useState, useEffect } from 'react'
import { ActivityManager } from './ActivityManager'
import { useTrips } from '../../hooks/useTrips'

const ActivityPage: React.FC = () => {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const { trips, isLoading, isError } = useTrips()

  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0].id)
    }
  }, [trips, selectedTripId])

  if (isLoading) return <div>Loading trips...</div>
  if (isError) return <div>Error loading trips. Please try again later.</div>
  if (!trips || trips.length === 0) return <div>No trips found. Please create a trip first.</div>

  return (
    <div>
      <select
        value={selectedTripId || ''}
        onChange={(e) => setSelectedTripId(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {trips.map((trip) => (
          <option key={trip.id} value={trip.id}>
            {trip.name}
          </option>
        ))}
      </select>
      {selectedTripId && <ActivityManager tripId={selectedTripId} />}
    </div>
  )
}

export default ActivityPage
