"use client"

import React from "react"
import Link from "next/link"
import { BudgetTracker } from "../budget/BudgetTracker"
import { PackingList } from "../utils/PackingList"
import { ActivityManager } from "../activities/ActivityManager"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useToast, Toast } from "../ui/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { format, parseISO } from 'date-fns'
import { Trip } from "../../lib/database.types"
import WeatherComponent from "../weather/WeatherComponent"
import { useTrip } from "../../hooks/useTrip"
import { Button } from "../ui/button"
import CurrencyConverter from "../utils/CurrencyConverter"
import HotelManager from "../accommodation/HotelManager"
import TripItinerary from "./TripItinerary"

interface TripDetailsProps {
  tripId: string
}

function ItineraryTab({ trip }: { trip: Trip }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
      <TripItinerary trip={trip} />
    </div>
  )
}

function DocumentsTab({ trip }: { trip: Trip }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Documents</h3>
      <p>Document management functionality to be implemented.</p>
    </div>
  )
}

export default function TripDetails({ tripId }: TripDetailsProps) {
  const { trip, isLoading, isError } = useTrip(tripId)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy')
    } catch (error) {
      console.error('Error parsing date:', error)
      return dateString // fallback to original string if parsing fails
    }
  }

  if (isLoading) {
    return <div>Loading trip details...</div>
  }

  if (isError) {
    return <div>Error loading trip details. Please try again later.</div>
  }

  if (!trip) {
    return <div>No trip details found.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{trip.name}</CardTitle>
          <Link href={`/trips/${trip.id}/edit`} passHref>
            <Button variant="outline">Edit Trip</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <p>Destination: {trip.destination}</p>
          <p>Start Date: {formatDate(trip.start_date)}</p>
          <p>End Date: {formatDate(trip.end_date)}</p>
          <p className="flex items-center space-x-2">
            <span>Total Budget:</span>
            <CurrencyConverter 
              initialAmount={trip.total_budget}
              initialFromCurrency={trip.currency}
              autoConvert={true}
            />
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="itinerary">
        <TabsList>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary">
          <ItineraryTab trip={trip} />
        </TabsContent>
        <TabsContent value="activities">
          <ActivityManager tripId={trip.id} />
        </TabsContent>
        <TabsContent value="hotels">
          <HotelManager tripId={trip.id} />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetTracker tripId={trip.id} />
        </TabsContent>
        <TabsContent value="weather">
          <WeatherComponent 
            latitude={trip.latitude} 
            longitude={trip.longitude}
            tripId={trip.id}
            destination={trip.destination}
            startDate={trip.start_date}
            endDate={trip.end_date}
          />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsTab trip={trip} />
        </TabsContent>
      </Tabs>

      <PackingList tripId={trip.id} />
      {toast && <Toast {...toast} />}
    </div>
  )
}
