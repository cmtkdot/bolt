import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../lib/database.types';
import { Trip, Activity } from '../../lib/database.types';

interface BudgetOverviewProps {
  trips: Trip[];
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ trips }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchActivities = async () => {
      const tripIds = trips.map(trip => trip.id);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .in('trip_id', tripIds);

      if (error) {
        console.error('Error fetching activities:', error);
      } else {
        setActivities(data || []);
      }
    };

    fetchActivities();
  }, [trips, supabase]);

  useEffect(() => {
    const budget = trips.reduce((total, trip) => total + trip.total_budget, 0);
    setTotalBudget(budget);

    const spent = activities.reduce((total, activity) => total + activity.price, 0);
    setTotalSpent(spent);
  }, [trips, activities]);

  const remainingBudget = totalBudget - totalSpent;

  // Assuming all trips use the same currency
  const currency = trips[0]?.currency || 'USD';

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Budget Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Total Budget</h3>
          <p className="text-2xl">{totalBudget} {currency}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Spent</h3>
          <p className="text-2xl">{totalSpent} {currency}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Remaining</h3>
          <p className="text-2xl">{remainingBudget} {currency}</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Trip Expenses</h3>
        {trips.map((trip) => (
          <div key={trip.id} className="mb-4">
            <h4 className="text-lg font-semibold">{trip.name}</h4>
            <ul className="space-y-2">
              {activities
                .filter((activity) => activity.trip_id === trip.id)
                .map((activity) => (
                  <li key={activity.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                    <span>{activity.title}</span>
                    <span>{activity.price} {trip.currency}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetOverview;
