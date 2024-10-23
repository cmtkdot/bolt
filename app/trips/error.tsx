'use client'

import React from 'react'

interface TripsErrorProps {
  error: Error
  reset: () => void
}

const TripsError: React.FC<TripsErrorProps> = ({ error, reset }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Error Loading Trips</h1>
      <p className="text-red-500 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Try again
      </button>
    </div>
  )
}

export default TripsError
