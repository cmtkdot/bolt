'use client'

import React from 'react'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function AuthError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-bold mb-4">Authentication Error</h2>
      <p className="text-red-500 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
