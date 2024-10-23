'use client'

import React from 'react'

interface ErrorProps {
  error: Error
  reset: () => void
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
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

export default Error
