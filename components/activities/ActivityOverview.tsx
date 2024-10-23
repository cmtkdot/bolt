'use client'
import React, { useState, useMemo } from 'react'
import { CalendarDays } from 'lucide-react'
import { Database } from '../../lib/database.types'

type Activity = Database['public']['Tables']['activities']['Row']

type ActivityOverviewProps = {
  activities: Activity[]
}

export default function ActivityOverview({ activities }: ActivityOverviewProps) {
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [searchTerm, setSearchTerm] = useState('')

  const sortedAndFilteredActivities = useMemo(() => {
    return activities
      .filter(activity => 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime()
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        return 0
      })
  }, [activities, searchTerm, sortBy])

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
          className="ml-2 p-2 border rounded"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
      {sortedAndFilteredActivities.map((activity) => (
        <div key={activity.id} className="mb-4 p-4 border rounded-lg">
          <h3 className="font-bold text-lg">{activity.title}</h3>
          <div className="flex items-center text-gray-600 mt-2">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>{activity.date}</span>
          </div>
          {activity.description && (
            <p className="text-gray-700 mt-2">{activity.description}</p>
          )}
          <p className="text-gray-600 mt-2">
            {activity.start_time} - {activity.end_time}
          </p>
          <p className="text-gray-600">Location: {activity.location}</p>
          <p className="text-gray-600">Price: ${activity.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}
