import React from 'react';

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Activity</h1>
      {children}
    </div>
  );
}
