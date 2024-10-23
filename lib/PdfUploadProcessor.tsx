import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PdfUploadProcessorProps {
  tripId: string
  onProcessed: (data: any) => void
}

const PdfUploadProcessor: React.FC<PdfUploadProcessorProps> = ({ tripId, onProcessed }) => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [documentType, setDocumentType] = useState<'flight' | 'hotel' | 'itinerary'>('itinerary')
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tripId', tripId)
    formData.append('type', documentType)

    try {
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process PDF')
      }

      const result = await response.json()
      onProcessed(result.data)
      toast({
        title: 'Success',
        description: `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} document processed successfully`,
      })
    } catch (error) {
      console.error('Error uploading PDF:', error)
      toast({
        title: 'Error',
        description: 'Failed to process the document. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      setFile(null)
    }
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <Select value={documentType} onValueChange={(value: 'flight' | 'hotel' | 'itinerary') => setDocumentType(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select document type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="flight">Flight</SelectItem>
          <SelectItem value="hotel">Hotel</SelectItem>
          <SelectItem value="itinerary">Itinerary</SelectItem>
        </SelectContent>
      </Select>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Upload and Process PDF'
        )}
      </Button>
    </div>
  )
}

export default PdfUploadProcessor
