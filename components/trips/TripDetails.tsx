import React from 'react';
import { Trip } from '@/lib/database.types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ActivityManager } from '../activities/ActivityManager';
import HotelManager from '../accommodation/HotelManager';
import { BudgetOverview } from '../budget/BudgetOverview';
import TripItinerary from '../trip/TripItinerary';

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{trip.name}</h1>
      <p className="text-xl text-gray-600">{trip.destination}</p>
      <p className="text-gray-600">
        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
      </p>
      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary" className="mt-4">
          <TripItinerary trip={trip} />
        </TabsContent>
        <TabsContent value="activities" className="mt-4">
          <ActivityManager tripId={trip.id} />
        </TabsContent>
        <TabsContent value="hotels" className="mt-4">
          <HotelManager tripId={trip.id} />
        </TabsContent>
        <TabsContent value="budget" className="mt-4">
          <BudgetOverview trip={trip} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripDetails;
