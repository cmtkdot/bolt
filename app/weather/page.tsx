'use client'

import React, { useState } from 'react'
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import WeatherComponent from "../../components/weather/WeatherComponent"

export default function WeatherPage() {
  const [city, setCity] = useState('')
  const [coordinates, setCoordinates] = useState<{ lat: number | null, lon: number | null }>({ lat: null, lon: null })

  const handleSearch = async () => {
    try {
      // This is a placeholder for the actual API call to get coordinates
      // You should replace this with a real geocoding service
      const response = await fetch(`/api/geocode?city=${encodeURIComponent(city)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates')
      }
      const data = await response.json()
      setCoordinates({ lat: data.lat, lon: data.lon })
    } catch (error) {
      console.error('Error fetching coordinates:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Weather Forecast</h1>
      <div className="flex space-x-4 mb-6">
        <Input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {coordinates.lat !== null && coordinates.lon !== null && (
        <WeatherComponent latitude={coordinates.lat} longitude={coordinates.lon} />
      )}
    </div>
  )
}
