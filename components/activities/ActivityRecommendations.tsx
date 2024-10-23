'use client'

import React, { useState } from 'react'
import { useActivityRecommendations } from './ActivityRecommendationsContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'

export function ActivityRecommendations() {
  const { recommendations, isLoading, fetchRecommendations, addActivityToTrip } = useActivityRecommendations()
  const [destination, setDestination] = useState('')
  const [interests, setInterests] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const interestsList = interests.split(',').map(interest => interest.trim())
    fetchRecommendations(destination, interestsList)
  }

  const handleAddActivity = (activity: any) => {
    addActivityToTrip({
      ...activity,
      date: '', // You might want to set a default date or let the user choose
      start_time: '',
      end_time: '',
      price: 0,
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Activity Recommendations</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination:</label>
          <Input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Interests (comma-separated):</label>
          <Input
            type="text"
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get Recommendations'}
        </Button>
      </form>
      {isLoading ? (
        <p>Loading recommendations...</p>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((activity, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{activity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{activity.description || 'No description available.'}</p>
                <p>Location: {activity.location}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleAddActivity(activity)}>Add to Trip</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No recommendations available. Please enter a destination and interests to get started.</p>
      )}
    </div>
  )
}
