import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Clock, MapPin, DollarSign, Plus } from 'lucide-react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from '@/lib/database.types'
import { useToast } from "@/hooks/useToast"
import WeatherComponent from '../weather/WeatherComponent'
import CurrencyConverter from '../utils/CurrencyConverter'
import PdfUploadProcessor from '../utils/PdfUploadProcessor'
import { getLocalCurrency } from '@/utils/currencyUtils'
import dynamic from 'next/dynamic'

const WeatherWidget = dynamic(() => import('@/app/itinerary/WeatherWidget'), { ssr: false })

type Activity = Database['public']['Tables']['activities']['Row']
type Trip = Database['public']['Tables']['trips']['Row']

interface GroupedActivities {
  [key: string]: Activity[]
}

interface EnhancedItineraryViewProps {
  viewType: 'daily' | 'weekly' | 'full'
  tripId: string
}

export default function EnhancedItineraryView({ viewType, tripId }: EnhancedItineraryViewProps) {
  const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>({})
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id' | 'created_at' | 'updated_at'>>({
    trip_id: tripId,
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    price: 0,
    itinerary_id: null,
    order: 0,
  })

  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchTripAndActivities()
  }, [viewType, tripId])

  async function fetchTripAndActivities() {
    try {
      setIsLoading(true)
      setError(null)

      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      if (tripError) throw tripError

      setTrip(tripData)

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('trip_id', tripId)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (activitiesError) throw activitiesError

      const grouped = (activitiesData as Activity[]).reduce((acc, activity) => {
        const date = activity.date
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(activity)
        return acc
      }, {} as GroupedActivities)

      setGroupedActivities(grouped)
    } catch (error) {
      setError('Failed to fetch trip data')
      console.error('Error fetching trip data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceDate = source.droppableId
    const destDate = destination.droppableId

    const newGroupedActivities = { ...groupedActivities }

    const sourceActivities = [...newGroupedActivities[sourceDate]]
    const [reorderedActivity] = sourceActivities.splice(source.index, 1)

    if (sourceDate === destDate) {
      sourceActivities.splice(destination.index, 0, reorderedActivity)
      newGroupedActivities[sourceDate] = sourceActivities
    } else {
      const destActivities = [...newGroupedActivities[destDate]]
      destActivities.splice(destination.index, 0, reorderedActivity)
      newGroupedActivities[sourceDate] = sourceActivities
      newGroupedActivities[destDate] = destActivities
    }

    setGroupedActivities(newGroupedActivities)

    // Here you would typically update the backend with the new order
    // This is just a placeholder for where you'd make that API call
    console.log('Update backend with new order', newGroupedActivities)
  }

  // ... (rest of the component code remains the same)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{trip?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-2">Destination: {trip?.destination}</p>
          <p className="text-lg mb-2">
            {trip?.start_date && new Date(trip.start_date).toLocaleDateString()} - {trip?.end_date && new Date(trip.end_date).toLocaleDateString()}
          </p>
          <p className="text-lg mb-2">Budget: {trip?.total_budget} USD</p>
          {trip && (
            <CurrencyConverter
              initialAmount={trip.total_budget}
              initialFromCurrency="USD"
              initialToCurrency={getLocalCurrency(trip.destination)}
              autoConvert={true}
            />
          )}
          {trip?.destination && <WeatherWidget location={trip.destination} />}
        </CardContent>
      </Card>

      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="add-activity">Add Activity</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="pdf-upload">Upload PDF</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="space-y-8">
              {Object.entries(groupedActivities).map(([date, activities]) => (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle>{new Date(date).toLocaleDateString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={date}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                          {activities.map((activity, index) => (
                            <Draggable key={activity.id} draggableId={activity.id.toString()} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white rounded-lg shadow p-4"
                                >
                                  <h3 className="font-bold text-lg mb-2">{activity.title}</h3>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {activity.start_time && activity.end_time && (
                                      <Badge variant="secondary">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {activity.start_time} - {activity.end_time}
                                      </Badge>
                                    )}
                                    {activity.location && (
                                      <Badge variant="secondary">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {activity.location}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                  <p className="text-sm font-semibold">
                                    <DollarSign className="w-4 h-4 inline" />
                                    {activity.price.toFixed(2)} USD
                                  </p>
                                  {trip && (
                                    <CurrencyConverter
                                      initialAmount={activity.price}
                                      initialFromCurrency="USD"
                                      initialToCurrency={getLocalCurrency(trip.destination)}
                                      autoConvert={true}
                                    />
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>

        {/* ... (other TabsContent remain the same) */}

        <TabsContent value="currency">
          {trip && (
            <CurrencyConverter
              initialAmount={trip.total_budget}
              initialFromCurrency="USD"
              initialToCurrency={getLocalCurrency(trip.destination)}
              autoConvert={true}
              className="mt-4"
            />
          )}
        </TabsContent>

        {/* ... (rest of the component remains the same) */}
      </Tabs>
    </div>
  )
}
