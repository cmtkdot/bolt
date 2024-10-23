import React from 'react';

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="trips-layout">
      <h1 className="text-2xl font-bold mb-4">Trips</h1>
      {children}
    </div>
  );
}
