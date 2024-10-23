"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { extractTextFromPdf, parseFlightInfo } from "@/lib/ocr-utils"

type Flight = {
  id: number
  trip_id: number
  airline: string
  flight_number: string
  departure_date: string
  departure_time: string
  arrival_date: string
  arrival_time: string
  departure_airport: string
  arrival_airport: string
  ticket_pdf_url: string | null
}

export function FlightManager({ tripId }: { tripId: number }) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [newFlight, setNewFlight] = useState<Omit<Flight, 'id' | 'trip_id' | 'ticket_pdf_url'>>({
    airline: '',
    flight_number: '',
    departure_date: '',
    departure_time: '',
    arrival_date: '',
    arrival_time: '',
    departure_airport: '',
    arrival_airport: '',
  })
  const [ticketPdf, setTicketPdf] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (tripId) {
      fetchFlights()
    }
  }, [tripId])

  async function fetchFlights() {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('trip_id', tripId)
      .order('departure_date', { ascending: true })

    if (error) {
      toast({
        title: "Error fetching flights",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setFlights(data || [])
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const text = await extractTextFromPdf(file)
      const flightInfo = parseFlightInfo(text)
      
      setNewFlight({
        airline: flightInfo.airline || '',
        flight_number: flightInfo.flightNumber || '',
        departure_date: flightInfo.departureDate || '',
        departure_time: flightInfo.departureTime || '',
        arrival_date: flightInfo.arrivalDate || '',
        arrival_time: flightInfo.arrivalTime || '',
        departure_airport: flightInfo.departureAirport || '',
        arrival_airport: flightInfo.arrivalAirport || '',
      })

      setTicketPdf(file)

      toast({
        title: "Flight information extracted",
        description: "Please review and edit if necessary before adding.",
      })
    } catch (error) {
      toast({
        title: "Error processing ticket",
        description: "Failed to extract information from the PDF. Please enter details manually.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddFlight() {
    setIsLoading(true)
    let ticket_pdf_url = null

    if (ticketPdf) {
      const { data, error } = await supabase.storage
        .from('flight-tickets')
        .upload(`${tripId}/${newFlight.flight_number}.pdf`, ticketPdf)

      if (error) {
        toast({
          title: "Error uploading ticket PDF",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      ticket_pdf_url = data.path
    }

    const { data, error } = await supabase
      .from('flights')
      .insert({ ...newFlight, trip_id: tripId, ticket_pdf_url })
      .select()

    if (error) {
      toast({
        title: "Error adding flight",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setFlights([...flights, data[0]])
      setNewFlight({
        airline: '',
        flight_number: '',
        departure_date: '',
        departure_time: '',
        arrival_date: '',
        arrival_time: '',
        departure_airport: '',
        arrival_airport: '',
      })
      setTicketPdf(null)
      toast({
        title: "Flight added",
        description: "Your new flight has been added successfully.",
      })
    }
    setIsLoading(false)
  }

  async function handleDeleteFlight(id: number, ticket_pdf_url: string | null) {
    if (ticket_pdf_url) {
      const { error: deleteError } = await supabase.storage
        .from('flight-tickets')
        .remove([ticket_pdf_url])

      if (deleteError) {
        toast({
          title: "Error deleting ticket PDF",
          description: deleteError.message,
          variant: "destructive",
        })
        return
      }
    }

    const { error } = await supabase
      .from('flights')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        title: "Error deleting flight",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setFlights(flights.filter(flight => flight.id !== id))
      toast({
        title: "Flight deleted",
        description: "The flight has been deleted successfully.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Flight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="ticket_pdf">Upload Ticket PDF (Optional)</Label>
              <Input
                id="ticket_pdf"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  value={newFlight.airline}
                  onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="flight_number">Flight Number</Label>
                <Input
                  id="flight_number"
                  value={newFlight.flight_number}
                  onChange={(e) => setNewFlight({ ...newFlight, flight_number: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure_date">Departure Date</Label>
                <Input
                  id="departure_date"
                  type="date"
                  value={newFlight.departure_date}
                  onChange={(e) => setNewFlight({ ...newFlight, departure_date: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="departure_time">Departure Time</Label>
                <Input
                  id="departure_time"
                  type="time"
                  value={newFlight.departure_time}
                  onChange={(e) => setNewFlight({ ...newFlight, departure_time: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="arrival_date">Arrival Date</Label>
                <Input
                  id="arrival_date"
                  type="date"
                  value={newFlight.arrival_date}
                  onChange={(e) => setNewFlight({ ...newFlight, arrival_date: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="arrival_time">Arrival Time</Label>
                <Input
                  id="arrival_time"
                  type="time"
                  value={newFlight.arrival_time}
                  onChange={(e) => setNewFlight({ ...newFlight, arrival_time: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure_airport">Departure Airport</Label>
                <Input
                  id="departure_airport"
                  value={newFlight.departure_airport}
                  onChange={(e) => setNewFlight({ ...newFlight, departure_airport: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="arrival_airport">Arrival Airport</Label>
                <Input
                  id="arrival_airport"
                  value={newFlight.arrival_airport}
                  onChange={(e) => setNewFlight({ ...newFlight, arrival_airport: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button onClick={handleAddFlight} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Flight"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flights.map((flight) => (
          <Card key={flight.id}>
            <CardHeader>
              <CardTitle>{flight.airline} - {flight.flight_number}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Departure:</strong> {flight.departure_airport} on {new Date(`${flight.departure_date}T${flight.departure_time}`).toLocaleString()}</p>
              <p><strong>Arrival:</strong> {flight.arrival_airport} on {new Date(`${flight.arrival_date}T${flight.arrival_time}`).toLocaleString()}</p>
              {flight.ticket_pdf_url && (
                <Button
                  className="mt-2"
                  onClick={() => window.open(supabase.storage.from('flight-tickets').getPublicUrl(flight.ticket_pdf_url!).data.publicUrl)}
                >
                  View Ticket
                </Button>
              )}
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteFlight(flight.id, flight.ticket_pdf_url)}
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