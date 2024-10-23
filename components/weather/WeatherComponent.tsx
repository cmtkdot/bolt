'use client'
import React, { useState, useEffect } from 'react';

interface WeatherComponentProps {
  latitude: number | null;
  longitude: number | null;
  tripId?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
}

export default function WeatherComponent({ 
  latitude, 
  longitude, 
  tripId, 
  destination, 
  startDate, 
  endDate 
}: WeatherComponentProps) {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude]);

  async function fetchWeatherData() {
    if (latitude === null || longitude === null) {
      setWeatherData(null);
      return;
    }
    // Fetch weather data using the latitude and longitude
    // You can use an API like OpenWeatherMap here
    // For now, let's just set some dummy data
    setWeatherData({
      temperature: 25,
      condition: 'Sunny',
      location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
    });
  }

  if (!weatherData) return <div>Loading weather data...</div>;

  return (
    <div>
      <h3>Weather for {weatherData.location}</h3>
      <p>Temperature: {weatherData.temperature}°C</p>
      <p>Condition: {weatherData.condition}</p>
      {tripId && (
        <div>
          <p>Trip ID: {tripId}</p>
          <p>Destination: {destination}</p>
          <p>Date Range: {startDate} to {endDate}</p>
        </div>
      )}
    </div>
  );
}
