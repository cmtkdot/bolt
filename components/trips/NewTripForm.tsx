'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createTrip } from '@/app/actions/tripActions.server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/useToast'
import { Trip } from '@/lib/database.types'

declare global {
  interface Window {
    google: any;
  }
}

export default function NewTripForm() {
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [location, setLocation] = useState('')
  const [name, setName] = useState('')
  const [totalBudget, setTotalBudget] = useState<number>(0)
  const [currency, setCurrency] = useState('USD')
  const [timeZone, setTimeZone] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const autocompleteRef = useRef<HTMLInputElement>(null)
  const autocompleteInstance = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && autocompleteRef.current) {
      autocompleteInstance.current = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['(cities)']
      })

      autocompleteInstance.current.addListener('place_changed', handlePlaceSelect)
    }
  }, [])

  const handlePlaceSelect = () => {
    const place = autocompleteInstance.current.getPlace()
    setDestination(place.name)
    setLocation(place.formatted_address)
    setLatitude(place.geometry.location.lat())
    setLongitude(place.geometry.location.lng())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newTrip = await createTrip({
        name,
        destination,
        start_date: startDate,
        end_date: endDate,
        latitude,
        longitude,
        location,
        total_budget: totalBudget,
        currency,
        time_zone: timeZone,
        is_public: true,
        itinerary: [], // Changed from null to an empty array
      } as Omit<Trip, "id" | "created_at" | "updated_at">)
      toast({
        title: 'Success',
        description: 'Trip created successfully!',
      })
      router.push(`/trips/${newTrip.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create trip. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Trip Name
        </label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
          Destination
        </label>
        <Input
          type="text"
          id="destination"
          ref={autocompleteRef}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <Input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <Input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700">
          Total Budget
        </label>
        <Input
          type="number"
          id="totalBudget"
          value={totalBudget}
          onChange={(e) => setTotalBudget(parseFloat(e.target.value))}
          required
          className="mt-1"
        />
      </div>
      <Button type="submit">Create Trip</Button>
    </form>
  )
}
