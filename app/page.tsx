'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, DollarSign, Umbrella, Plane, Camera, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/login')
  }

  const handleSignUp = () => {
    router.push('/signup')
  }

  const features = [
    { icon: <MapPin className="h-8 w-8" />, title: 'Trip Planning', description: 'Plan and organize your trips with ease' },
    { icon: <Calendar className="h-8 w-8" />, title: 'Itinerary Management', description: 'Create detailed day-by-day itineraries' },
    { icon: <DollarSign className="h-8 w-8" />, title: 'Budget Tracking', description: 'Keep track of your expenses and stay on budget' },
    { icon: <Umbrella className="h-8 w-8" />, title: 'Weather Forecasts', description: 'Get real-time weather updates for your destinations' },
    { icon: <Plane className="h-8 w-8" />, title: 'Travel Documents', description: 'Store and organize all your travel documents' },
    { icon: <Camera className="h-8 w-8" />, title: 'Photo Albums', description: 'Create beautiful memories with trip photo albums' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="flex justify-between items-center mb-16">
          <div className="w-48 h-48 relative">
            <Image
              src="/logo.png"
              alt="Jon & Steph's Adventures"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div>
            <Button onClick={handleLogin} variant="ghost" className="mr-2">
              Log In
            </Button>
            <Button onClick={handleSignUp}>
              Sign Up
            </Button>
          </div>
        </div>

        <div className="text-center mb-16 flex-grow flex flex-col justify-center">
          <h2 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Plan Your Dream Trip with Ease
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            All-in-one travel planner to make your adventures unforgettable
          </p>
          <Button onClick={handleSignUp} size="lg" className="mx-auto">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="mb-2 text-blue-500">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
