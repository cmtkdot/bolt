import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { useToast } from "@/hooks/useToast"
import ActivityForm, { ActivityFormData } from './ActivityForm'

type Activity = Database['public']['Tables']['activities']['Row']

interface ActivityManagerProps {
  tripId: string
}

export function ActivityManager({ tripId }: ActivityManagerProps) {
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const handleSubmit = async (data: ActivityFormData) => {
    try {
      const { data: newActivity, error } = await supabase
        .from('activities')
        .insert([{ ...data, trip_id: tripId }])
        .select()

      if (error) throw error

      toast({
        title: "Activity added",
        description: "Your new activity has been added successfully.",
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding your activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Activity</h2>
      <ActivityForm onSubmit={handleSubmit} />
    </div>
  )
}
