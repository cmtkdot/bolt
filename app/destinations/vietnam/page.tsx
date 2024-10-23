'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Utensils, Sunrise, Umbrella } from 'lucide-react'

export default function VietnamPage() {
  const attractions = [
    { name: 'Ha Long Bay', description: 'Cruise through limestone karsts and isles in this UNESCO World Heritage site.', image: 'https://images.unsplash.com/photo-1528127269322-539801943592' },
    { name: 'Hoi An Ancient Town', description: 'Explore the well-preserved ancient town known for its lantern-lit streets.', image: 'https://images.unsplash.com/photo-1540870352430-76b3351f2f8d' },
    { name: 'Sapa Rice Terraces', description: 'Trek through stunning rice terraces and meet local hill tribes.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Discover Vietnam
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <Image 
          src="https://images.unsplash.com/photo-1557750255-c76072a7aad1"
          alt="Vietnam Landscape"
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
            <p>October to April for dry and mild weather in most regions.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Utensils className="inline-block mr-2" /> Must-Try Food</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pho, Banh Mi, Fresh Spring Rolls, and Vietnamese Coffee.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Sunrise className="inline-block mr-2" /> Top Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cruise Ha Long Bay, explore Hoi An, trek Sapa rice terraces.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Umbrella className="inline-block mr-2" /> Climate</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tropical in the south, monsoonal in the north with a hot, rainy season.</p>
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