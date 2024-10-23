"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useToast, Toast } from "../ui/use-toast"
import { Spinner } from "../ui/spinner"
import { supabase } from "../../lib/supabase"
import { Database, PackingItem } from "../../lib/database.types"

export function PackingList({ tripId }: { tripId: string }): React.ReactElement {
  const [items, setItems] = useState<PackingItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast, showToast } = useToast()

  useEffect(() => {
    fetchPackingList()
  }, [tripId])

  async function fetchPackingList() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('packing_items')
        .select('*')
        .eq('trip_id', tripId)

      if (error) throw error

      setItems(data || [])
    } catch (error) {
      console.error('Error fetching packing list:', error)
      showToast({
        message: "Failed to fetch packing list",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newItem.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('packing_items')
        .insert([
          { trip_id: tripId, item_name: newItem.trim(), is_packed: false, quantity: 1 }
        ])
        .select()

      if (error) throw error

      setItems([...items, data[0] as PackingItem])
      setNewItem("")
      showToast({
        message: "Item added successfully",
        type: "success",
      })
    } catch (error) {
      console.error('Error adding item:', error)
      showToast({
        message: "Failed to add item",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleItem(id: number, packed: boolean) {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('packing_items')
        .update({ is_packed: packed })
        .eq('id', id)

      if (error) throw error

      setItems(items.map(item => item.id === id ? { ...item, is_packed: packed } : item))
    } catch (error) {
      console.error('Error updating item:', error)
      showToast({
        message: "Failed to update item",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function removeItem(id: number) {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('packing_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(items.filter(item => item.id !== id))
      showToast({
        message: "Item removed successfully",
        type: "success",
      })
    } catch (error) {
      console.error('Error removing item:', error)
      showToast({
        message: "Failed to remove item",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && items.length === 0) {
    return <Spinner />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Packing List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addItem} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add new item"
              aria-label="New packing item"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>Add</Button>
          </div>
        </form>
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center space-x-2">
              <Checkbox
                checked={item.is_packed}
                onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                aria-label={`Mark ${item.item_name} as ${item.is_packed ? 'unpacked' : 'packed'}`}
                disabled={isLoading}
              />
              <span className={item.is_packed ? "line-through" : ""}>{item.item_name}</span>
              <span className="text-gray-500"> (Quantity: {item.quantity})</span>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.item_name} from packing list`}
                disabled={isLoading}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </Card>
  )
}
