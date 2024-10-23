import React from 'react'
import { Trip, Activity, Expense } from '@/lib/database.types'

interface TravelStatsProps {
  trips: Trip[]
  activities: Activity[]
  expenses: Expense[]
}

export default function TravelStats({ trips, activities, expenses }: TravelStatsProps) {
  const totalTrips = trips.length
  const totalActivities = activities.length
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Travel Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-600">Total Trips</p>
          <p className="text-2xl font-bold">{totalTrips}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Activities</p>
          <p className="text-2xl font-bold">{totalActivities}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
