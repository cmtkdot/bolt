import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type Expense = {
  id: number
  trip_id: number
  amount: number
  currency: string
  category: string
  description: string
  date: string
}

export function ExpenseTracker({ tripId }: { tripId: number }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'trip_id'>>({
    amount: 0,
    currency: 'USD',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (tripId) {
      fetchExpenses()
    }
  }, [tripId])

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: false })

    if (error) {
      toast({
        title: "Error fetching expenses",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setExpenses(data || [])
    }
  }

  async function handleAddExpense() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...newExpense, trip_id: tripId })
      .select()

    if (error) {
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setExpenses([...expenses, data[0]])
      setNewExpense({
        amount: 0,
        currency: 'USD',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      toast({
        title: "Expense added",
        description: "Your new expense has been added successfully.",
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={newExpense.currency}
                onValueChange={(value) => setNewExpense({ ...newExpense, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  {/* Add more currencies as needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleAddExpense} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{expense.description}</p>
                  <p className="text-sm text-gray-500">{expense.category} - {new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <p className="font-bold">{expense.amount} {expense.currency}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}