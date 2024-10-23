import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number }>;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ center, zoom = 10, markers = [] }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const mapCenter = useMemo(() => center, [center]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap zoom={zoom} center={mapCenter} mapContainerClassName="w-full h-[400px]">
      {markers.map((marker, index) => (
        <Marker key={index} position={marker} />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
