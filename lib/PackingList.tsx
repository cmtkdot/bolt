import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";
import { Database, PackingItem } from "@/lib/database.types";
import { Toast } from "@/components/ui/toast";

export function PackingList({ tripId }: { tripId: string }): React.ReactElement {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackingList();
  }, [tripId]);

  async function fetchPackingList() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('packing_items')
        .select('*')
        .eq('trip_id', tripId);

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error('Error fetching packing list:', error);
      toast({
        title: "Error",
        description: "Failed to fetch packing list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // ... rest of the component implementation

  return (
    <Card>
      {/* ... rest of the JSX */}
      {isLoading && <Spinner />}
    </Card>
  );
}
