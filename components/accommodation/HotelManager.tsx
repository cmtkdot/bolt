import React, { useState, useEffect } from 'react';
import { Hotel, NewHotel } from '../../lib/database.types';
import { addHotelToTrip, getHotelsForTrip, updateHotel, deleteHotel } from '../../app/actions/tripActions';
import HotelForm from './HotelForm';

interface HotelManagerProps {
  tripId: string;
}

const HotelManager: React.FC<HotelManagerProps> = ({ tripId }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    fetchHotels();
  }, [tripId]);

  const fetchHotels = async () => {
    const fetchedHotels = await getHotelsForTrip(tripId);
    setHotels(fetchedHotels);
  };

  const handleAddHotel = async (newHotel: NewHotel) => {
    await addHotelToTrip(tripId, newHotel);
    fetchHotels();
  };

  const handleUpdateHotel = async (updatedHotel: Hotel) => {
    await updateHotel(updatedHotel.id, updatedHotel);
    fetchHotels();
    setEditingHotel(null);
  };

  const handleDeleteHotel = async (hotelId: string) => {
    await deleteHotel(hotelId);
    fetchHotels();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hotels</h2>
      <HotelForm tripId={tripId} onSubmit={handleAddHotel} />
      <div className="space-y-2">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="border p-4 rounded-md">
            <h3 className="text-xl font-semibold">{hotel.name}</h3>
            <p>{hotel.address}</p>
            <p>Check-in: {hotel.check_in_date} | Check-out: {hotel.check_out_date}</p>
            <p>Price: ${hotel.price}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => setEditingHotel(hotel)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteHotel(hotel.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <HotelForm
              tripId={tripId}
              hotel={editingHotel}
              onSubmit={handleUpdateHotel}
              onCancel={() => setEditingHotel(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManager;
