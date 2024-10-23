'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import CurrencyConverter from '../../components/utils/CurrencyConverter'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../lib/database.types'
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Skeleton } from "../../components/ui/skeleton"

type Trip = Database['public']['Tables']['trips']['Row']
type Activity = Database['public']['Tables']['activities']['Row']

const getLocalCurrency = (destination: string): string => {
  const lowercaseDestination = destination.toLowerCase()
  if (lowercaseDestination.includes('vietnam')) return 'VND'
  if (lowercaseDestination.includes('thailand')) return 'THB'
  // Add more destination-currency mappings as needed
  return 'USD' // Default to USD if no match is found
}

export default function CurrencyPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchTrips()
  }, [])

  useEffect(() => {
    if (selectedTrip) {
      fetchActivities(selectedTrip.id)
    }
  }, [selectedTrip])

  async function fetchTrips() {
    setIsLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching trips:', error)
      setError('Failed to fetch trips. Please try again.')
    } else {
      setTrips(data || [])
      if (data && data.length > 0) {
        setSelectedTrip(data[0])
      }
    }
    setIsLoading(false)
  }

  async function fetchActivities(tripId: string) {
    setIsLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching activities:', error)
      setError('Failed to fetch activities. Please try again.')
    } else {
      setActivities(data || [])
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Currency Converter</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>General Currency Converter</CardTitle>
          <CardDescription>Convert any amount between different currencies</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyConverter />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Trip Budget Overview</CardTitle>
          <CardDescription>View and convert your trip budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="trip-select">Select Trip</Label>
            <Select
              value={selectedTrip?.id || ''}
              onValueChange={(value) => setSelectedTrip(trips.find(trip => trip.id === value) || null)}
            >
              <SelectTrigger id="trip-select">
                <SelectValue placeholder="Select a trip" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.destination} ({new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <Skeleton className="h-[100px] w-full" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : selectedTrip ? (
            <div>
              <p className="font-bold mb-2">Total Budget: {selectedTrip.total_budget} USD</p>
              <CurrencyConverter 
                initialAmount={selectedTrip.total_budget}
                initialFromCurrency="USD"
                initialToCurrency={getLocalCurrency(selectedTrip.destination)}
                autoConvert={true}
              />
            </div>
          ) : (
            <p>No trip selected. Please select a trip to view its budget.</p>
          )}
        </CardContent>
      </Card>

      {selectedTrip && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Budgets</CardTitle>
            <CardDescription>View and convert budgets for individual activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="mb-6 p-4 border rounded">
                  <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                  <p className="mb-1">Date: {new Date(activity.date).toLocaleDateString()}</p>
                  <p className="mb-2">Budget: {activity.price} USD</p>
                  <CurrencyConverter 
                    initialAmount={activity.price}
                    initialFromCurrency="USD"
                    initialToCurrency={getLocalCurrency(selectedTrip.destination)}
                    autoConvert={true}
                  />
                </div>
              ))
            ) : (
              <p>No activities found for this trip.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
