import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlightManager } from "@/components/trips/FlightManager"
import { HotelManager } from "@/components/trips/HotelManager"

interface TripFormData {
  title: string
  description: string
  start_date: Date
  end_date: Date
  location: string
  price: number
}

interface TripFormProps {
  initialData?: Partial<TripFormData>
  onSubmit: (data: TripFormData) => void
}

export default function TripForm({ initialData, onSubmit }: TripFormProps) {
  const { register, handleSubmit, control } = useForm<TripFormData>({ 
    defaultValues: initialData 
  })
  const [activeTab, setActiveTab] = useState('details')

  const handleFormSubmit = (data: TripFormData) => {
    onSubmit(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Trip' : 'Plan a New Trip'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Trip Title</Label>
                <Input id="title" {...register('title', { required: true })} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Controller
                    name="start_date"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <DatePicker {...field} />}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Controller
                    name="end_date"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <DatePicker {...field} />}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location', { required: true })} />
              </div>
              <div>
                <Label htmlFor="price">Estimated Price</Label>
                <Input type="number" id="price" {...register('price', { valueAsNumber: true })} />
              </div>
              <Button type="submit">{initialData ? 'Update Trip' : 'Create Trip'}</Button>
            </form>
          </TabsContent>
          <TabsContent value="flights">
            <FlightManager tripId={initialData?.id} />
          </TabsContent>
          <TabsContent value="hotels">
            <HotelManager tripId={initialData?.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}