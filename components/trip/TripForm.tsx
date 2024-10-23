"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Trip } from '@/lib/database.types'
import { Loader } from '@googlemaps/js-api-loader'
import { CurrencyConverter } from '@/components/utils/CurrencyConverter'

type TripFormData = Omit<Trip, 'id' | 'created_at' | 'updated_at'>

interface TripFormProps {
  onSubmit: (trip: TripFormData) => void
  initialData?: Partial<TripFormData>
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<TripFormData>({
    name: initialData?.name || '',
    destination: initialData?.destination || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    itinerary: initialData?.itinerary || null,
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    location: initialData?.location || '',
    total_budget: initialData?.total_budget || 0,
    currency: initialData?.currency || 'USD',
    time_zone: initialData?.time_zone || 'UTC',
    is_public: initialData?.is_public || false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"]
    })

    loader.load().then(() => {
      initAutocomplete()
    }).catch((e) => {
      console.error("Error loading Google Maps API:", e)
    })
  }, [])

  const initAutocomplete = () => {
    if (inputRef.current && window.google && window.google.maps && window.google.maps.places) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current)
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
    }
  }

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace()
    if (place) {
      const latitude = place.geometry?.location?.lat() ?? null
      const longitude = place.geometry?.location?.lng() ?? null
      const formattedAddress = place.formatted_address || ''

      setFormData(prev => ({
        ...prev,
        destination: formattedAddress,
        latitude,
        longitude,
        location: formattedAddress,
      }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_public: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      onSubmit(formData)
    } catch (error: any) {
      setError(`Failed to ${initialData ? 'update' : 'add'} trip: ${error.message}`)
      console.error(`Error ${initialData ? 'updating' : 'adding'} trip:`, error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Trip' : 'Add New Trip'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Trip Name</Label>
            <Input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='destination'>Destination</Label>
            <Input
              type='text'
              id='destination'
              name='destination'
              ref={inputRef}
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='start_date'>Start Date</Label>
            <Input
              type='date'
              id='start_date'
              name='start_date'
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='end_date'>End Date</Label>
            <Input
              type='date'
              id='end_date'
              name='end_date'
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='total_budget'>Total Budget</Label>
            <div className="flex items-center space-x-2">
              <Input
                type='number'
                id='total_budget'
                name='total_budget'
                value={formData.total_budget}
                onChange={handleChange}
                required
              />
              <CurrencyConverter amount={formData.total_budget} fromCurrency={formData.currency} />
            </div>
          </div>
          <div>
            <Label htmlFor='currency'>Currency</Label>
            <Select name='currency' value={formData.currency} onValueChange={(value: string) => setFormData(prev => ({ ...prev, currency: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                <SelectItem value="EUR">EUR (Euro)</SelectItem>
                <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                <SelectItem value="VND">VND (Vietnamese Dong)</SelectItem>
                <SelectItem value="THB">THB (Thai Baht)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='time_zone'>Time Zone</Label>
            <Input
              type='text'
              id='time_zone'
              name='time_zone'
              value={formData.time_zone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="is_public">Make trip public</Label>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type='submit' disabled={loading}>
            {loading ? `${initialData ? 'Updating' : 'Adding'} Trip...` : `${initialData ? 'Update' : 'Add'} Trip`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default TripForm
