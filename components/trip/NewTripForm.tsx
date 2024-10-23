"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import TripForm from './TripForm'
import { createTrip } from '../../app/actions/tripActions'
import { Trip } from '../../lib/database.types'

type TripFormData = Omit<Trip, 'id' | 'created_at' | 'updated_at'>

const NewTripForm: React.FC = () => {
  const router = useRouter()

  const handleSubmit = async (tripData: TripFormData) => {
    try {
      const newTrip = await createTrip(tripData)
      router.push(`/trips/${newTrip.id}`)
    } catch (error) {
      console.error('Failed to create trip:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  return <TripForm onSubmit={handleSubmit} />
}

export default NewTripForm
