"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Trip } from '@/lib/database.types';
import { Loader } from '@googlemaps/js-api-loader';
import SharedForm from '@/components/shared/SharedForm';
import { z } from 'zod';
import { getCurrencyByCountry, getCurrencyConversion } from '@/utils/currencyUtils';
import countries from 'i18n-iso-countries';

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

type TripsFormData = Omit<Trip, 'id' | 'created_at' | 'updated_at'>;

interface TripsFormProps {
  onSubmit: (trips: TripsFormData) => void;
  initialData?: Partial<TripsFormData>;
  isEditing?: boolean;
}

const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  destination: z.string().min(1, 'Destination is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  itinerary: z.array(z.any()).nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  location: z.string(),
  total_budget: z.number().min(0, 'Budget must be non-negative'),
  currency: z.string().min(1, 'Currency is required'),
  time_zone: z.string().min(1, 'Time zone is required'),
  is_public: z.literal(true),
});

const TripsForm: React.FC<TripsFormProps> = ({ initialData, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState<Partial<TripsFormData>>(initialData || {});
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      initAutocomplete();
    }).catch((e) => {
      console.error("Error loading Google Maps API:", e);
    });
  }, []);

  const initAutocomplete = () => {
    if (inputRef.current && window.google && window.google.maps && window.google.maps.places) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
      if (autocompleteRef.current) {
        autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
      }
    }
  };

  const handlePlaceSelect = async () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        const latitude = place.geometry?.location?.lat() ?? null;
        const longitude = place.geometry?.location?.lng() ?? null;
        const formattedAddress = place.formatted_address || '';

        // Get the country from the address components
        const countryComponent = place.address_components?.find(
          (component) => component.types.includes('country')
        );
        const country = countryComponent?.long_name || '';

        // Get currency for the country
        const currency = getCurrencyByCountry(country) || 'USD';

        // Get time zone using the Google Maps Time Zone API
        if (latitude && longitude) {
          const timestamp = Math.floor(Date.now() / 1000);
          try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
            const data = await response.json();
            
            setFormData(prev => {
              const newData = {
                ...prev,
                destination: formattedAddress,
                latitude,
                longitude,
                location: formattedAddress,
                currency,
                time_zone: data.timeZoneId || '',
                is_public: true,
              };

              // Convert budget to the new currency if it exists
              if (prev.total_budget && prev.currency && prev.currency !== currency) {
                getCurrencyConversion(prev.total_budget, prev.currency, currency)
                  .then(convertedBudget => {
                    setFormData(prevData => ({
                      ...prevData,
                      total_budget: convertedBudget,
                    }));
                  })
                  .catch(error => {
                    console.error('Error converting currency:', error);
                  });
              }

              return newData;
            });
          } catch (error) {
            console.error('Error fetching time zone:', error);
          }
        }
      }
    }
  };

  const fields = [
    { name: 'name', label: 'Trip Name', type: 'text' as const, required: true },
    {
      name: 'destination',
      label: 'Destination',
      type: 'custom' as const,
      required: true,
      render: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setFormData(prev => ({ ...prev, destination: e.target.value }));
          }}
          className="w-full p-2 border rounded"
        />
      ),
    },
    { name: 'start_date', label: 'Start Date', type: 'date' as const, required: true },
    { name: 'end_date', label: 'End Date', type: 'date' as const, required: true },
    { name: 'total_budget', label: 'Total Budget', type: 'number' as const, required: true },
    {
      name: 'currency',
      label: 'Currency',
      type: 'text' as const,
      required: true,
      readOnly: true,
    },
    {
      name: 'time_zone',
      label: 'Time Zone',
      type: 'text' as const,
      required: true,
      readOnly: true,
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validatedData = tripSchema.parse({ ...formData, ...data, is_public: true });
      onSubmit(validatedData as TripsFormData);
    } catch (error) {
      console.error('Error submitting trip:', error);
      throw error;
    }
  };

  return (
    <SharedForm
      title={isEditing ? 'Edit Trip' : 'Add New Trip'}
      fields={fields}
      onSubmit={handleSubmit}
      initialData={formData}
      submitButtonText={isEditing ? 'Update Trip' : 'Add Trip'}
    />
  );
};

export default TripsForm;
