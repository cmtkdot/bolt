import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

type Activity = Database['public']['Tables']['activities']['Row']

interface ActivityListProps {
  tripId: string
}

export default function ActivityList({ tripId }: ActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchActivities() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('trip_id', tripId)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) {
        setError('Error fetching activities')
        console.error('Error fetching activities:', error)
      } else {
        setActivities(data || [])
      }
      setIsLoading(false)
    }

    fetchActivities()
  }, [tripId])

  if (isLoading) return <div>Loading activities...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-white shadow rounded-lg p-4">
          <h3 className="font-bold text-lg">{activity.title}</h3>
          <p className="text-gray-600">{activity.date} {activity.start_time} - {activity.end_time}</p>
          <p>{activity.description}</p>
          <p className="text-gray-600">Location: {activity.location}</p>
          <p className="font-semibold">Price: ${activity.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}
