'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Utensils, Sunrise, Umbrella } from 'lucide-react'

export default function ThailandPage() {
  const attractions = [
    { name: 'Grand Palace, Bangkok', description: 'Explore the magnificent former residence of Thai kings and the Temple of the Emerald Buddha.', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed' },
    { name: 'Phi Phi Islands', description: 'Relax on stunning beaches and snorkel in crystal-clear waters of these picturesque islands.', image: 'https://images.unsplash.com/photo-1537956965359-7d1c4e4171c3' },
    { name: 'Chiang Mai Night Bazaar', description: 'Shop for local crafts and enjoy street food at this vibrant night market.', image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Explore Thailand
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <Image 
          src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a"
          alt="Thailand Landscape"
          width={1200}
          height={600}
          className="rounded-lg shadow-lg"
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle><MapPin className="inline-block mr-2" /> Best Time to Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <p>November to April for dry and cooler weather across most of the country.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Utensils className="inline-block mr-2" /> Must-Try Food</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pad Thai, Tom Yum Goong, Green Curry, and Mango Sticky Rice.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Sunrise className="inline-block mr-2" /> Top Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Visit temples in Bangkok, relax on beaches, explore night markets.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Umbrella className="inline-block mr-2" /> Climate</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tropical climate with three main seasons: hot, cool, and rainy.</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-bold mb-6">Top Attractions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {attractions.map((attraction, index) => (
          <motion.div
            key={attraction.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <Image 
                src={attraction.image}
                alt={attraction.name}
                width={400}
                height={300}
                className="rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>{attraction.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{attraction.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}