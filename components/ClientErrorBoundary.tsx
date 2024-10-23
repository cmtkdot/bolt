'use client'

import React from 'react'
import ErrorBoundary from './ErrorBoundary'

export default function ClientErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">We&apos;re sorry, but something went wrong.</p>
        <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Refresh Page
        </button>
      </div>
    }>
      {children}
    </ErrorBoundary>
  )
}
