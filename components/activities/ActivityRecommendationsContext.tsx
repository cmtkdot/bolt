'use client'

import React, { createContext, useContext, useState } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Activity } from '../../lib/database.types'

type ActivityRecommendationsContextType = {
  recommendations: Activity[]
  setRecommendations: React.Dispatch<React.SetStateAction<Activity[]>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  fetchRecommendations: (destination: string, interests: string[]) => Promise<void>
  saveRecommendation: (activity: Omit<Activity, 'id' | 'order' | 'itinerary_id'>, itineraryId: string) => Promise<void>
  tripId: string
  addActivityToTrip: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
}

const ActivityRecommendationsContext = createContext<ActivityRecommendationsContextType | undefined>(undefined)

export const useActivityRecommendations = () => {
  const context = useContext(ActivityRecommendationsContext)
  if (!context) {
    throw new Error('useActivityRecommendations must be used within an ActivityRecommendationsProvider')
  }
  return context
}

export const ActivityRecommendationsProvider: React.FC<{ children: React.ReactNode; tripId: string; addActivityToTrip: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => Promise<void> }> = ({ children, tripId, addActivityToTrip }) => {
  const [recommendations, setRecommendations] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const fetchRecommendations = async (destination: string, interests: string[]) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/openai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, interests }),
      })
      const data = await response.json()
      if (response.ok) {
        setRecommendations(data.recommendations.map((activity: { name: string }) => ({
          id: 0, // Placeholder ID
          title: activity.name,
          description: '', // OpenAI doesn't provide a description, so we leave it empty
          date: '', // To be set when saving
          start_time: '', // To be set when saving
          end_time: '', // To be set when saving
          location: destination, // We use the destination as a general location
          price: 0, // Price is not provided by OpenAI, so we set it to 0
          latitude: 0, // Coordinates are not provided, so we set them to 0
          longitude: 0,
          order: 0, // To be set when saving
          itinerary_id: '', // To be set when saving
          trip_id: tripId, // Include the trip_id
        })))
      } else {
        throw new Error(data.error || 'Failed to fetch recommendations')
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  const saveRecommendation = async (activity: Omit<Activity, 'id' | 'order' | 'itinerary_id'>, itineraryId: string) => {
    try {
      const { data: maxOrderActivity } = await supabase
        .from('activities')
        .select('order')
        .eq('itinerary_id', itineraryId)
        .order('order', { ascending: false })
        .limit(1)
        .single()

      const newOrder = maxOrderActivity ? maxOrderActivity.order + 1 : 1

      const { data, error } = await supabase
        .from('activities')
        .insert([
          { ...activity, itinerary_id: itineraryId, order: newOrder, trip_id: tripId }
        ])
        .select()

      if (error) throw error

      // Update the recommendations list to remove the saved activity
      setRecommendations(prev => prev.filter(rec => rec.title !== activity.title))

      return data[0]
    } catch (error) {
      console.error('Error saving recommendation:', error)
      throw error
    }
  }

  return (
    <ActivityRecommendationsContext.Provider value={{ recommendations, setRecommendations, isLoading, setIsLoading, fetchRecommendations, saveRecommendation, tripId, addActivityToTrip }}>
      {children}
    </ActivityRecommendationsContext.Provider>
  )
}
