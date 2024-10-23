import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import EnhancedItineraryView from './EnhancedItineraryView'
import { Trip } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ItineraryViewWrapperProps = {
  viewType: 'daily' | 'weekly' | 'full'
}

export default function ItineraryViewWrapper({ viewType }: ItineraryViewWrapperProps) {
  const searchParams = useSearchParams()
  const tripId = searchParams.get('tripId')

  if (!tripId) {
    return <div>Error: No trip ID provided</div>
  }

  return <EnhancedItineraryView viewType={viewType} tripId={tripId} />
}
