'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const destinations = [
  { 
    id: 'vietnam',
    name: 'Vietnam', 
    image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1',
    description: 'Explore ancient temples, cruise through limestone karsts, and savor delicious street food.'
  },
  { 
    id: 'thailand',
    name: 'Thailand', 
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a',
    description: 'Relax on stunning beaches, visit ornate temples, and experience vibrant night markets.'
  },
  // Add more destinations as needed
]

export default function DestinationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Explore Our Destinations
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((destination, index) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <Image 
                src={destination.image}
                alt={destination.name}
                width={400}
                height={300}
                className="rounded-t-lg object-cover h-48"
              />
              <CardHeader>
                <CardTitle>{destination.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{destination.description}</CardDescription>
              </CardContent>
              <div className="p-4 mt-auto">
                <Link href={`/destinations/${destination.id}`}>
                  <Button className="w-full">Explore {destination.name}</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}