'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import TripList from '../trip/TripList'
import ActivityOverview from '../activities/ActivityOverview'
import WeatherWidget from '../weather/WeatherWidget'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

type Trip = Database['public']['Tables']['trips']['Row']
type Activity = Database['public']['Tables']['activities']['Row']

export default function DashboardOverview() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [weatherData, setWeatherData] = useState<any>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchData() {
      // Fetch trips
      const { data: tripsData } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: true })
        .limit(5)
      if (tripsData) setTrips(tripsData)

      // Fetch activities
      const { data: activitiesData } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true })
        .limit(10)
      if (activitiesData) setActivities(activitiesData)

      // Fetch weather data (mock for now)
      setWeatherData({
        temperature: 22,
        condition: 'Sunny',
        location: 'Current Location',
        date: new Date().toLocaleDateString()
      })
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <TripList trips={trips} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weather Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {weatherData && <WeatherWidget {...weatherData} />}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityOverview activities={activities} />
        </CardContent>
      </Card>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/trips/new">Create New Trip</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/trips">View All Trips</Link>
        </Button>
      </div>
    </div>
  )
}
