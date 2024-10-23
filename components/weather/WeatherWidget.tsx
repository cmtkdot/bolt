'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

interface WeatherWidgetProps {
  temperature: number
  condition: string
  location: string
  date: string
}

export default function WeatherWidget({ temperature, condition, location, date }: WeatherWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather in {location}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-2xl font-bold" aria-label={`Temperature: ${temperature} degrees Celsius`}>
              {temperature}°C
            </p>
            <p aria-label={`Weather condition: ${condition}`}>{condition}</p>
            <p aria-label={`Date: ${date}`}>{date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
