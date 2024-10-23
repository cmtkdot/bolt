'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import ItineraryViewWrapper from '../../components/itinerary/ItineraryViewWrapper'

export default function ItineraryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'full'>('daily')

  const tripId = searchParams.get('tripId')

  if (!tripId) {
    return <div>Error: No trip ID provided</div>
  }

  const handleViewChange = (value: string) => {
    setViewType(value as 'daily' | 'weekly' | 'full')
    router.push(`/itinerary?tripId=${tripId}&viewType=${value}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trip Itinerary</h1>
      <div className="flex justify-between items-center mb-6">
        <Select onValueChange={handleViewChange} defaultValue={viewType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily View</SelectItem>
            <SelectItem value="weekly">Weekly View</SelectItem>
            <SelectItem value="full">Full Trip View</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => router.push(`/activity/new?tripId=${tripId}`)}>Add New Activity</Button>
      </div>
      <ItineraryViewWrapper viewType={viewType} />
    </div>
  )
}
