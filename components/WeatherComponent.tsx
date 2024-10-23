'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'

interface WeatherData {
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  name: string
}

interface WeatherComponentProps {
  city: string
}

const WeatherComponent: React.FC<WeatherComponentProps> = ({ city }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError('Error fetching weather data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (city) {
      fetchWeather()
    }
  }, [city])

  if (loading) return <div>Loading weather data...</div>
  if (error) return <div>{error}</div>
  if (!weatherData) return null

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Weather in {weatherData.name}</h2>
      <p>Temperature: {weatherData.main.temp}°C</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Description: {weatherData.weather[0].description}</p>
      <img 
        src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} 
        alt={weatherData.weather[0].description}
      />
      <Button onClick={fetchWeather} className="mt-4">Refresh</Button>
    </div>
  )
}

export default WeatherComponent
