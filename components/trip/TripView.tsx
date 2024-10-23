import React from 'react'
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface Trip {
  id: string
  created_at: string
  name: string
  destination: string
  start_date: string
  end_date: string
  total_budget: number | null
  currency: string | null
  time_zone: string | null
  is_public: boolean
  user_id: string
}

const TripView: React.FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{trip.name}</h1>
      <p className="mb-2">Destination: {trip.destination}</p>
      <p className="mb-2">Start Date: {formatDate(new Date(trip.start_date))}</p>
      <p className="mb-2">End Date: {formatDate(new Date(trip.end_date))}</p>
      <Button variant="outline">
        {trip.is_public ? "Make Private" : "Make Public"}
      </Button>
    </div>
  )
}

export default TripView
