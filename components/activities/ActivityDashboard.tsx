import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Activity, Database } from '../../lib/database.types'
import { updateActivity, deleteActivity, addActivity } from '../../app/actions/tripActions.server'
import ActivityForm from './ActivityForm'
import ActivityCard from './ActivityCard'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'

interface ActivityDashboardProps {
  tripId: string
}

export default function ActivityDashboard({ tripId }: ActivityDashboardProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingActivity, setIsAddingActivity] = useState(false)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchActivities()
  }, [tripId])

  async function fetchActivities() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('trip_id', tripId)
      .order('order', { ascending: true })

    if (error) {
      setError('Error fetching activities')
      console.error('Error fetching activities:', error)
    } else {
      setActivities(data || [])
    }
    setIsLoading(false)
  }

  const handleAddActivity = async (newActivity: Activity) => {
    try {
      const addedActivity = await addActivity(tripId, newActivity)
      setActivities(prevActivities => [...prevActivities, addedActivity])
      setIsAddingActivity(false)
    } catch (error) {
      console.error('Failed to add activity', error)
      setError('Failed to add activity')
    }
  }

  const handleUpdateActivity = async (updatedActivity: Activity) => {
    try {
      const fullUpdatedActivity = await updateActivity(updatedActivity)
      setActivities(prev => 
        prev.map(act => act.id === fullUpdatedActivity.id ? fullUpdatedActivity : act)
      )
    } catch (err) {
      setError('Failed to update activity')
      console.error(err)
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteActivity(activityId, tripId)
      setActivities(prev => prev.filter(act => act.id !== activityId))
    } catch (err) {
      setError('Failed to delete activity')
      console.error(err)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(activities)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedActivities = items.map((item, index) => ({
      ...item,
      order: index
    }))

    setActivities(updatedActivities)

    // Update the order in the database
    try {
      await Promise.all(updatedActivities.map(activity => 
        updateActivity({ ...activity, order: activity.order })
      ))
    } catch (error) {
      console.error('Failed to update activity order', error)
      setError('Failed to update activity order')
    }
  }

  if (isLoading) return <div>Loading activities...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Droppable droppableId="activities">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {activities.map((activity, index) => (
                  <Draggable key={activity.id} draggableId={activity.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ActivityCard
                          activity={activity}
                          onUpdate={handleUpdateActivity}
                          onDelete={handleDeleteActivity}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {isAddingActivity ? (
            <ActivityForm 
              onSubmit={handleAddActivity}
              onCancel={() => setIsAddingActivity(false)}
            />
          ) : (
            <Button onClick={() => setIsAddingActivity(true)} className="mt-4">
              Add New Activity
            </Button>
          )}
        </CardContent>
      </Card>
    </DragDropContext>
  )
}