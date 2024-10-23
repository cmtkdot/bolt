import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Sun, Cloud, CloudRain, Loader } from 'lucide-react'
import axios from 'axios'

type WeatherWidgetProps = {
  location: string | { lat: number; lng: number };
}

type WeatherData = {
  temperature: number;
  condition: string;
  icon: string;
  locationName: string;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function WeatherWidget({ location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        let lat, lng, locationName;

        if (typeof location === 'string') {
          // Use Google Geocoding API to get coordinates
          const geocodeResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_API_KEY}`
          );
          const results = geocodeResponse.data.results;
          if (results && results.length > 0) {
            lat = results[0].geometry.location.lat;
            lng = results[0].geometry.location.lng;
            locationName = results[0].formatted_address;
          } else {
            throw new Error('Location not found');
          }
        } else {
          lat = location.lat;
          lng = location.lng;
          // Reverse geocode to get location name
          const reverseGeocodeResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
          );
          locationName = reverseGeocodeResponse.data.results[0]?.formatted_address || 'Unknown location';
        }

        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`
        );

        setWeather({
          temperature: Math.round(weatherResponse.data.main.temp),
          condition: weatherResponse.data.weather[0].main,
          icon: weatherResponse.data.weather[0].icon,
          locationName: locationName,
        });
      } catch (err) {
        setError('Error fetching weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading) return <Loader className="animate-spin" />;
  if (error) return <div>{error}</div>;
  if (!weather) return null;

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-lg font-semibold">{weather.locationName}</p>
          <p className="text-3xl font-bold">{weather.temperature}°C</p>
          <p>{weather.condition}</p>
        </div>
        <img 
          src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
          alt={weather.condition} 
          className="w-16 h-16"
        />
      </CardContent>
    </Card>
  );
}
