import React from 'react';

export default function ItineraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="itinerary-layout">
      <h1 className="text-2xl font-bold mb-4">Itinerary</h1>
      {children}
    </div>
  );
}
