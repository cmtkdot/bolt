import React from 'react'
import { Activity } from '@/lib/types'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import ActivityForm from './ActivityForm'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/hooks/useToast'

type AddActivityFormProps = {
  tripId: string
  date: string
  onActivityAdded: (newActivity: Activity) => void
}

const AddActivityForm: React.FC<AddActivityFormProps> = ({ tripId, date, onActivityAdded }) => {
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleSubmit = async (data: Partial<Activity>) => {
    try {
      const { data: newActivity, error } = await supabase
        .from('activities')
        .insert({ ...data, trip_id: tripId, date })
        .select()
        .single()

      if (error) throw error

      onActivityAdded(newActivity as Activity)
      toast({
        title: "Success",
        description: "Activity added successfully.",
      })
    } catch (error) {
      console.error('Error adding activity:', error)
      toast({
        title: "Error",
        description: "Failed to add activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Add Activity</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
        </DialogHeader>
        <ActivityForm 
          initialData={{ date }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddActivityForm
