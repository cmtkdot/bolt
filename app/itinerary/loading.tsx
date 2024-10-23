import React from 'react';
import { Spinner } from '../../components/ui/spinner';

export default function ItineraryLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
