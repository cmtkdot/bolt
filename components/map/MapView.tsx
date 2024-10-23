import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { MapPin } from 'lucide-react';

type Trip = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  latitude: number | null;
  longitude: number | null;
};

interface MapViewProps {
  trips: Trip[];
}

const MapView: React.FC<MapViewProps> = ({ trips }) => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Filter out trips with invalid coordinates
  const validTrips = trips.filter(
    (trip) => typeof trip.latitude === 'number' && 
              typeof trip.longitude === 'number' && 
              !isNaN(trip.latitude) && 
              !isNaN(trip.longitude)
  );

  // Calculate the center of all valid trips
  const center = validTrips.reduce(
    (acc, trip) => {
      acc.latitude += trip.latitude!;
      acc.longitude += trip.longitude!;
      return acc;
    },
    { latitude: 0, longitude: 0 }
  );

  const initialViewState = validTrips.length > 0
    ? {
        latitude: center.latitude / validTrips.length,
        longitude: center.longitude / validTrips.length,
        zoom: 2
      }
    : {
        latitude: 0,
        longitude: 0,
        zoom: 1
      };

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      initialViewState={initialViewState}
      style={{ width: '100%', height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {validTrips.map((trip) => (
        <Marker
          key={trip.id}
          longitude={trip.longitude!}
          latitude={trip.latitude!}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedTrip(trip);
          }}
        >
          <MapPin className="text-red-500" />
        </Marker>
      ))}

      {selectedTrip && selectedTrip.latitude && selectedTrip.longitude && (
        <Popup
          longitude={selectedTrip.longitude}
          latitude={selectedTrip.latitude}
          anchor="top"
          onClose={() => setSelectedTrip(null)}
        >
          <div>
            <h3>{selectedTrip.name}</h3>
            <p>From: {new Date(selectedTrip.start_date).toLocaleDateString()}</p>
            <p>To: {new Date(selectedTrip.end_date).toLocaleDateString()}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default MapView;
