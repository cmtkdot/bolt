import React from 'react';
import { Spinner } from '../../components/ui/spinner';

export default function AuthLoading() {
  return (
    <div className="flex justify-center items-center h-full">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
