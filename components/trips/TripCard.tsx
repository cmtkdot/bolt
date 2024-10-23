import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock } from 'lucide-react'

interface TripCardProps {
  trip: {
    id: string
    name: string
    destination: string
    startDate: string
    endDate: string
    image?: string
  }
}

export default function TripCard({ trip }: TripCardProps) {
  const duration = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))

  return (
    <Card className="overflow-hidden">
      {trip.image ? (
        <div className="relative w-full h-48">
          <Image 
            src={trip.image} 
            alt={trip.name} 
            layout="fill"
            objectFit="cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <MapPin className="h-12 w-12 text-gray-400" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{trip.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="flex items-center mb-2">
          <MapPin className="mr-2 h-4 w-4" />
          {trip.destination}
        </p>
        <p className="flex items-center mb-2">
          <CalendarDays className="mr-2 h-4 w-4" />
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
        <p className="flex items-center mb-4">
          <Clock className="mr-2 h-4 w-4" />
          {duration} {duration === 1 ? 'day' : 'days'}
        </p>
        <Link href={`/trips/${trip.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  )
}