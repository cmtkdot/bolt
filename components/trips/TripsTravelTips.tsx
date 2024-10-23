'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Compass, Loader } from 'lucide-react'

interface TripTravelTipsProps {
  destination: string;
  tripType: string;
  duration: string;
}

export function TripTravelTips({ destination, tripType, duration }: TripTravelTipsProps) {
  const [tips, setTips] = useState<{ title: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/generate-travel-tips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ destination, tripType, duration }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch travel tips');
        }

        const data = await response.json();
        setTips(data.tips);
      } catch (err) {
        setError('Failed to load travel tips');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, [destination, tripType, duration]);

  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Travel Tips for {destination}</CardTitle>
        <CardDescription>Personalized advice for your {duration} {tripType} trip</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {tips.map((tip, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex items-center">
                  <Compass className="w-4 h-4 mr-2" />
                  {tip.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {tip.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
