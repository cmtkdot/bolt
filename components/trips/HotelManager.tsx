"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { extractTextFromPdf, parseHotelInfo } from "@/lib/ocr-utils"

type Hotel = {
  id: number
  trip_id: number
  name: string
  address: string
  check_in_date: string
  check_out_date: string
  reservation_number: string
  notes: string
  booking_pdf_url: string | null
}

export function HotelManager({ tripId }: { tripId: number }) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [newHotel, setNewHotel] = useState<Omit<Hotel, 'id' | 'trip_id' | 'booking_pdf_url'>>({
    name: '',
    address: '',
    check_in_date: '',
    check_out_date: '',
    reservation_number: '',
    notes: '',
  })
  const [bookingPdf, setBookingPdf] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (tripId) {
      fetchHotels()
    }
  }, [tripId])

  async function fetchHotels() {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('trip_id', tripId)
      .order('check_in_date', { ascending: true })

    if (error) {
      toast({
        title: "Error fetching hotels",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setHotels(data || [])
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const text = await extractTextFromPdf(file)
      const hotelInfo = parseHotelInfo(text)
      
      setNewHotel({
        name: hotelInfo.name || '',
        address: hotelInfo.address || '',
        check_in_date: hotelInfo.checkInDate || '',
        check_out_date: hotelInfo.checkOutDate || '',
        reservation_number: hotelInfo.reservationNumber || '',
        notes: '',
      })

      setBookingPdf(file)

      toast({
        title: "Hotel information extracted",
        description: "Please review and edit if necessary before adding.",
      })
    } catch (error) {
      toast({
        title: "Error processing booking",
        description: "Failed to extract information from the PDF. Please enter details manually.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddHotel() {
    setIsLoading(true)
    let booking_pdf_url = null

    if (bookingPdf) {
      const { data, error } = await supabase.storage
        .from('hotel-bookings')
        .upload(`${tripId}/${newHotel.name}.pdf`, bookingPdf)

      if (error) {
        toast({
          title: "Error uploading booking PDF",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      booking_pdf_url = data.path
    }

    const { data, error } = await supabase
      .from('hotels')
      .insert({ ...newHotel, trip_id: tripId, booking_pdf_url })
      .select()

    if (error) {
      toast({
        title: "Error adding hotel",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setHotels([...hotels, data[0]])
      setNewHotel({
        name: '',
        address: '',
        check_in_date: '',
        check_out_date: '',
        reservation_number: '',
        notes: '',
      })
      setBookingPdf(null)
      toast({
        title: "Hotel added",
        description: "Your new hotel has been added successfully.",
      })
    }
    setIsLoading(false)
  }

  async function handleDeleteHotel(id: number, booking_pdf_url: string | null) {
    if (booking_pdf_url) {
      const { error: deleteError } = await supabase.storage
        .from('hotel-bookings')
        .remove([booking_pdf_url])

      if (deleteError) {
        toast({
          title: "Error deleting booking PDF",
          description: deleteError.message,
          variant: "destructive",
        })
        return
      }
    }

    const { error } = await supabase
      .from('hotels')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        title: "Error deleting hotel",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setHotels(hotels.filter(hotel => hotel.id !== id))
      toast({
        title: "Hotel deleted",
        description: "The hotel has been deleted successfully.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Hotel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="booking_pdf">Upload Booking PDF (Optional)</Label>
              <Input
                id="booking_pdf"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="name">Hotel Name</Label>
              <Input
                id="name"
                value={newHotel.name}
                onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newHotel.address}
                onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check_in_date">Check-in Date</Label>
                <Input
                  id="check_in_date"
                  type="date"
                  value={newHotel.check_in_date}
                  onChange={(e) => setNewHotel({ ...newHotel, check_in_date: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="check_out_date">Check-out Date</Label>
                <Input
                  id="check_out_date"
                  type="date"
                  value={newHotel.check_out_date}
                  onChange={(e) => setNewHotel({ ...newHotel, check_out_date: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reservation_number">Reservation Number</Label>
              <Input
                id="reservation_number"
                value={newHotel.reservation_number}
                onChange={(e) => setNewHotel({ ...newHotel, reservation_number: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newHotel.notes}
                onChange={(e) => setNewHotel({ ...newHotel, notes: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleAddHotel} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Hotel"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <Card key={hotel.id}>
            <CardHeader>
              <CardTitle>{hotel.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Address:</strong> {hotel.address}</p>
              <p><strong>Check-in:</strong> {new Date(hotel.check_in_date).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(hotel.check_out_date).toLocaleDateString()}</p>
              <p><strong>Reservation:</strong> {hotel.reservation_number}</p>
              <p><strong>Notes:</strong> {hotel.notes}</p>
              {hotel.booking_pdf_url && (
                <Button
                  className="mt-2"
                  onClick={() => window.open(supabase.storage.from('hotel-bookings').getPublicUrl(hotel.booking_pdf_url!).data.publicUrl)}
                >
                  View Booking
                </Button>
              )}
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteHotel(hotel.id, hotel.booking_pdf_url)}
                className="mt-4"
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}