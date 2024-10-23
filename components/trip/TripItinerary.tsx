import React, { useEffect, useState } from 'react';
import { Trip } from './TripForm';

interface Activity {
  id: string;
  name: string;
  date: string;
  description: string;
}

interface TripItineraryProps {
  trip: Trip;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ trip }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/getActivities?tripId=${trip.id}`);
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        setActivities(data.activities);
      } catch (err) {
        setError('Failed to load activities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [trip.id]);

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Itinerary for {trip.name}</h2>
      {activities.length === 0 ? (
        <p>No activities planned yet.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id} className="mb-2">
              <strong>{activity.name}</strong> - {activity.date}
              <p>{activity.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TripItinerary;
