'use client'

import { ActivityRecommendations } from '../../components/activity-recommendations/ActivityRecommendations'
import { ActivityRecommendationsProvider } from '../../components/activity-recommendations/ActivityRecommendationsContext'

export default function ActivityRecommendationsPage() {
  return (
    <ActivityRecommendationsProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Activity Recommendations</h1>
        <ActivityRecommendations />
      </div>
    </ActivityRecommendationsProvider>
  )
}
