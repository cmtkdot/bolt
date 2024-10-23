import ItineraryViewWrapper from '@/components/itinerary/ItineraryViewWrapper'

interface ViewTypePageProps {
  params: {
    viewType: 'daily' | 'weekly' | 'full'
  }
}

export default function ViewTypePage({ params }: ViewTypePageProps) {
  return <ItineraryViewWrapper viewType={params.viewType} />
}
