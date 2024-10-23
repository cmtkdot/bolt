import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProcessedData {
  airline?: string;
  flightNumber?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureTime?: string;
  arrivalTime?: string;
  hotelName?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

interface PdfUploadProcessorProps {
  tripId: string;
  type: 'flight' | 'hotel';
  onProcessed: (data: ProcessedData) => void;
}

export default function PdfUploadProcessor({ tripId, type, onProcessed }: PdfUploadProcessorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const uploadAndProcessPdf = async () => {
    if (!file) return;

    setProcessing(true);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('public-travel-documents')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('public-travel-documents')
        .getPublicUrl(fileName);

      const response = await fetch('/api/processDocument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileUrl: publicUrlData.publicUrl, 
          type: type 
        }),
      });

      if (!response.ok) throw new Error('Failed to process PDF');

      const extractedData: ProcessedData = await response.json();
      onProcessed(extractedData);
    } catch (error) {
      console.error('Error processing PDF:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={uploadAndProcessPdf} disabled={!file || processing}>
        {processing ? 'Processing...' : `Upload and Process ${type.charAt(0).toUpperCase() + type.slice(1)} PDF`}
      </Button>
    </div>
  );
}
