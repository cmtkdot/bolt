import React from 'react'
import dynamic from 'next/dynamic'

const ActivityPage = dynamic(() => import('../../components/activities/ActivityPage'), { ssr: false })

const ActivityPageWrapper = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Activities</h1>
      <ActivityPage />
    </div>
  )
}

export default ActivityPageWrapper
