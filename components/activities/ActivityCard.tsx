import React, { useState } from 'react';
import { Activity } from '../../lib/database.types';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import ActivityForm from './ActivityForm';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DragHandle, Edit, Trash } from 'lucide-react';

export interface ActivityCardProps {
  activity: Activity;
  onUpdate: (updatedActivity: Activity) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onUpdate, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = async (updatedActivity: Activity) => {
    await onUpdate(updatedActivity);
    setIsEditModalOpen(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center">
        <DragHandle className="mr-2 cursor-move" />
        <CardTitle>{activity.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{activity.description}</p>
        <p>Date: {activity.date}</p>
        <p>Time: {activity.start_time} - {activity.end_time}</p>
        <p>Location: {activity.location}</p>
        <p>Price: {activity.price}</p>
        <div className="mt-4 space-x-2">
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Activity</DialogTitle>
              </DialogHeader>
              <ActivityForm
                initialData={activity}
                onSubmit={handleEdit}
                onCancel={() => setIsEditModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={() => onDelete(activity.id)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;