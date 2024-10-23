'use client'

import React, { useState } from 'react'
import { useActivityRecommendations } from './ActivityRecommendationsContext'

export function ActivityRecommendations() {
  const { recommendations, isLoading, fetchRecommendations } = useActivityRecommendations()
  const [destination, setDestination] = useState('')
  const [interests, setInterests] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const interestsList = interests.split(',').map(interest => interest.trim())
    fetchRecommendations(destination, interestsList)
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Activity Recommendations</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="destination" className="block mb-1">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="interests" className="block mb-1">Interests (comma-separated):</label>
          <input
            type="text"
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </form>
      {isLoading ? (
        <p>Loading recommendations...</p>
      ) : recommendations.length > 0 ? (
        <ul className="list-disc pl-5">
          {recommendations.map((activity, index) => (
            <li key={index}>{activity.name}</li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available. Please enter a destination and interests to get started.</p>
      )}
    </div>
  )
}
