import NewTripForm from '../../../components/trip/NewTripForm'

export default function NewTripPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create a New Trip</h1>
      <NewTripForm />
    </div>
  )
}
