import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
}

export default function DocumentUploader({ onUpload }: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".pdf,image/*" />
      <Button onClick={handleUpload} disabled={!file}>Upload</Button>
    </div>
  );
}
