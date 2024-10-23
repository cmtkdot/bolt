'use client'

import Link from 'next/link'
import { Database } from '../../lib/database.types'
import TripList from '../../components/trip/TripList'
import WeatherWidget from '../../components/weather/WeatherWidget'
import { BudgetOverview } from '../../components/budget/BudgetOverview'
import ActivityOverview from '../../components/activities/ActivityOverview'
import { useTrips } from '../../hooks/useTrips'

type Trip = Database['public']['Tables']['trips']['Row']
type Activity = Database['public']['Tables']['activities']['Row']

interface DashboardClientProps {
  activities: Activity[]
  weatherData: { temperature: number; condition: string; date: string } | null
  nextTrip: Trip | null
}

export default function DashboardClient({ 
  activities, 
  weatherData, 
  nextTrip
}: DashboardClientProps) {
  const { trips, isLoading, isError } = useTrips()

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  }

  if (isError) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">Failed to load trips. Please try again later.</span>
    </div>
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
          {trips && trips.length > 0 ? (
            <TripList trips={trips} />
          ) : (
            <p>No upcoming trips. Why not plan one?</p>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
          {nextTrip && weatherData ? (
            <WeatherWidget
              location={nextTrip.destination}
              temperature={weatherData.temperature}
              condition={weatherData.condition}
              date={weatherData.date}
            />
          ) : (
            <p>No upcoming trips or weather data available.</p>
          )}
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
        {trips && trips.length > 0 ? (
          <BudgetOverview trips={trips} />
        ) : (
          <p>No trips available for budget overview.</p>
        )}
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ActivityOverview activities={activities} />
      </div>
      <div className="flex space-x-4 justify-center">
        <Link href="/trips/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Trip
        </Link>
        <Link href="/trips" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          View All Trips
        </Link>
      </div>
    </div>
  )
}
