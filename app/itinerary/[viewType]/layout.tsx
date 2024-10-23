import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trip Itinerary',
  description: 'View and manage your trip itinerary',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

