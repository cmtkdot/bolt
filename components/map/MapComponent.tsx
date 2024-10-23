'use client'
import React, { useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker as GoogleMarker } from '@react-google-maps/api';
import Map, { Marker as MapboxMarker, Popup, MapLayerMouseEvent } from 'react-map-gl';
import { MapPin } from 'lucide-react';

interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  name?: string;
  startDate?: string;
  endDate?: string;
}

interface MapComponentProps {
  provider: 'google' | 'mapbox';
  center: { lat: number; lng: number };
  zoom: number;
  markers?: Marker[];
  height?: string;
  width?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  provider,
  center,
  zoom,
  markers = [],
  height = '400px',
  width = '100%',
}) => {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  const mapContainerStyle = {
    width,
    height,
  };

  const { isLoaded: isGoogleMapsLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const mapCenter = useMemo(() => center, [center]);

  if (provider === 'google' && !isGoogleMapsLoaded) return <div>Loading...</div>;

  if (provider === 'google') {
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
      >
        {markers.map((marker) => (
          <GoogleMarker
            key={marker.id}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}
      </GoogleMap>
    );
  }

  if (provider === 'mapbox') {
    return (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: zoom,
        }}
        style={mapContainerStyle}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {markers.map((marker) => (
          <MapboxMarker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            onClick={(e) => {
              // Using type assertion here
              (e as unknown as { originalEvent: MouseEvent }).originalEvent.stopPropagation();
              setSelectedMarker(marker);
            }}
          >
            <MapPin className="text-red-500" />
          </MapboxMarker>
        ))}

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            anchor="top"
            onClose={() => setSelectedMarker(null)}
          >
            <div>
              <h3>{selectedMarker.name}</h3>
              {selectedMarker.startDate && (
                <p>From: {new Date(selectedMarker.startDate).toLocaleDateString()}</p>
              )}
              {selectedMarker.endDate && (
                <p>To: {new Date(selectedMarker.endDate).toLocaleDateString()}</p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    );
  }

  return null;
};

export default MapComponent;
