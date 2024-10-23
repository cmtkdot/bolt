'use client'
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface SimpleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers?: { lat: number; lng: number }[];
}

const SimpleMap: React.FC<SimpleMapProps> = ({ center, zoom, markers = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
    >
      {markers.map((marker, index) => (
        <Marker key={index} position={marker} />
      ))}
    </GoogleMap>
  );
};

export default SimpleMap;

