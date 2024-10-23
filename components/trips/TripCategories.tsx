import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type Category = {
  id: number
  name: string
  description: string
}

export function TripCategories({ tripId }: { tripId: number }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (tripId) {
      fetchCategories()
    }
  }, [tripId])

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('trip_categories')
      .select('*')
      .eq('trip_id', tripId)

    if (error) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setCategories(data || [])
    }
  }

  async function handleAddCategory() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('trip_categories')
      .insert({ ...newCategory, trip_id: tripId })
      .select()

    if (error) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setCategories([...categories, data[0]])
      setNewCategory({ name: '', description: '' })
      toast({
        title: "Category added",
        description: "Your new category has been added successfully.",
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleAddCategory} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trip Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}