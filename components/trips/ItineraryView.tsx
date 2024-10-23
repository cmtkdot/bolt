'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Trip, Activity } from '@/lib/database.types'
import { getTrip, getActivities, updateTrip } from '@/app/actions/tripActions.server'
import ActivityDashboard from '@/components/activities/ActivityDashboard'
import dynamic from 'next/dynamic'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format, parseISO } from 'date-fns'
import { CalendarDays, DollarSign, MapPin, Plane, Hotel, Umbrella, Eye, EyeOff } from 'lucide-react'
import { BudgetOverview } from '@/components/budget/BudgetOverview'

const WeatherWidget = dynamic(() => import('@/components/weather/WeatherComponent'), { ssr: false })
const CurrencyConverter = dynamic(() => import('@/utils/CurrencyConverter'), { ssr: false })
const PdfUploadProcessor = dynamic(() => import('@/utils/PdfUploadProcessor'), { ssr: false })

interface ItineraryViewProps {
  tripId: string
  viewType: 'daily' | 'weekly' | 'full'
}

interface TravelTip {
  title: string
  content: string
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ tripId, viewType }) => {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [travelTips, setTravelTips] = useState<TravelTip[]>([])
  const [isTipsLoading, setIsTipsLoading] = useState(false)
  const [tipsError, setTipsError] = useState<string | null>(null)

  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const fetchTripAndActivities = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedTrip = await getTrip(tripId)
      if (!fetchedTrip) {
        throw new Error('Trip not found')
      }
      setTrip(fetchedTrip)
      
      const fetchedActivities = await getActivities(tripId)
      setActivities(fetchedActivities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trip details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchTripAndActivities()
  }, [fetchTripAndActivities])

  const generateTravelTips = async () => {
    if (!trip) return

    setIsTipsLoading(true)
    setTipsError(null)
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: trip.destination,
          tripType: 'general',
          duration: `${Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 3600 * 24))} days`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate travel tips')
      }

      const data = await response.json()
      setTravelTips(data.tips)
    } catch (err) {
      console.error('Error generating travel tips:', err)
      setTipsError('Failed to generate travel tips. Please try again.')
    } finally {
      setIsTipsLoading(false)
    }
  }

  const handlePdfProcessed = (processedData: any) => {
    console.log('Processed PDF data:', processedData)
    toast({
      title: 'PDF Processed',
      description: 'Your PDF has been successfully processed and the data has been added to your trip.',
    })
    fetchTripAndActivities()
  }

  const toggleTripVisibility = async () => {
    if (!trip) return
    try {
      const updatedTrip = await updateTrip({ ...trip, is_public: !trip.is_public })
      setTrip(updatedTrip)
      toast({
        title: 'Trip Visibility Updated',
        description: `Your trip is now ${updatedTrip.is_public ? 'public' : 'private'}.`,
      })
    } catch (err) {
      console.error('Error updating trip visibility:', err)
      toast({
        title: 'Error',
        description: 'Failed to update trip visibility. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading trip details...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  if (!trip) return <div className="text-center">No trip found</div>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="bg-sapphire-50">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-sapphire-900">{trip.destination}</CardTitle>
          <CardDescription className="text-sapphire-700">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5" />
              <span>{format(parseISO(trip.start_date), 'MMM d, yyyy')} - {format(parseISO(trip.end_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <DollarSign className="w-5 h-5" />
              <span>Budget: {trip.total_budget} {trip.currency}</span>
            </div>
            <Button
              variant="outline"
              onClick={toggleTripVisibility}
              className="mt-2 flex items-center"
            >
              {trip.is_public ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {trip.is_public ? "Make Private" : "Make Public"}
            </Button>
          </CardDescription>
        </CardHeader>
      </Card>

      <BudgetOverview trips={[trip]} />

      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="activities" className="w-full">
            <Umbrella className="w-4 h-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="travel-tips" className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            Travel Tips
          </TabsTrigger>
          <TabsTrigger value="weather" className="w-full">
            <Umbrella className="w-4 h-4 mr-2" />
            Weather
          </TabsTrigger>
          <TabsTrigger value="currency" className="w-full">
            <DollarSign className="w-4 h-4 mr-2" />
            Currency
          </TabsTrigger>
          <TabsTrigger value="pdf-upload" className="w-full">
            <Plane className="w-4 h-4 mr-2" />
            Upload PDF
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities">
          <ActivityDashboard
            tripId={tripId}
            viewType={viewType}
          />
        </TabsContent>

        <TabsContent value="travel-tips">
          <div className="space-y-4">
            <Button
              onClick={generateTravelTips}
              disabled={isTipsLoading}
              className="bg-sapphire-600 hover:bg-sapphire-700 text-white"
            >
              {isTipsLoading ? 'Generating...' : 'Generate Travel Tips'}
            </Button>
            {tipsError && <p className="text-red-500 mt-2">{tipsError}</p>}
            {travelTips.length > 0 && (
              <ul className="space-y-4">
                {travelTips.map((tip, index) => (
                  <li key={index} className="border-b border-sapphire-200 pb-4">
                    <h4 className="font-semibold text-sapphire-800">{tip.title}</h4>
                    <p className="text-sapphire-600">{tip.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="weather">
          <WeatherWidget location={trip.destination} />
        </TabsContent>

        <TabsContent value="currency">
          <CurrencyConverter
            initialAmount={trip.total_budget}
            initialFromCurrency={trip.currency}
            initialToCurrency="USD"
            autoConvert={true}
          />
        </TabsContent>

        <TabsContent value="pdf-upload">
          <PdfUploadProcessor 
            tripId={tripId}
            onProcessed={handlePdfProcessed}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ItineraryView
