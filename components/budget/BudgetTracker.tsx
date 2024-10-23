"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useToast, Toast } from "../ui/use-toast"
import { Spinner } from "../ui/spinner"
import { supabase } from "../../lib/supabase"
import { Trip, Json } from "../../lib/database.types"
import { CurrencyConverter } from "../utils/CurrencyConverter"

type Expense = {
  id: string
  description: string
  amount: number
  category: string
  type: 'expense'
}

function isExpense(item: any): item is Expense {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.description === 'string' &&
    typeof item.amount === 'number' &&
    typeof item.category === 'string' &&
    item.type === 'expense'
  )
}

export function BudgetTracker({ tripId }: { tripId: string }): React.ReactElement {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' })
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast, showToast } = useToast()

  useEffect(() => {
    fetchTripAndExpenses()
  }, [tripId])

  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    setTotalExpenses(total)
  }, [expenses])

  async function fetchTripAndExpenses() {
    setIsLoading(true)
    try {
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      if (tripError) throw tripError

      setTrip(tripData)

      if (tripData.itinerary && Array.isArray(tripData.itinerary)) {
        const expenseItems = tripData.itinerary.filter(isExpense)
        setExpenses(expenseItems)
      }
    } catch (error) {
      console.error('Error fetching trip and expenses:', error)
      showToast({
        message: "Failed to fetch trip and expenses",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function addExpense(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(newExpense.amount)
    if (isNaN(amount)) {
      showToast({
        message: "Please enter a valid amount",
        type: "error",
      })
      return
    }
    setIsLoading(true)
    try {
      const newExpenseItem: Expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: amount,
        category: newExpense.category,
        type: 'expense'
      }

      const updatedItinerary: Json = Array.isArray(trip?.itinerary)
        ? [...trip.itinerary, newExpenseItem]
        : [newExpenseItem]

      const { data, error } = await supabase
        .from('trips')
        .update({ itinerary: updatedItinerary })
        .eq('id', tripId)
        .select()

      if (error) throw error

      setExpenses([...expenses, newExpenseItem])
      setNewExpense({ description: '', amount: '', category: '' })
      showToast({
        message: "Expense added successfully",
        type: "success",
      })
    } catch (error) {
      console.error('Error adding expense:', error)
      showToast({
        message: "Failed to add expense",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function removeExpense(id: string) {
    setIsLoading(true)
    try {
      const updatedItinerary: Json = Array.isArray(trip?.itinerary)
        ? trip.itinerary.filter(item => !isExpense(item) || item.id !== id)
        : []

      const { error } = await supabase
        .from('trips')
        .update({ itinerary: updatedItinerary })
        .eq('id', tripId)

      if (error) throw error

      setExpenses(expenses.filter(expense => expense.id !== id))
      showToast({
        message: "Expense removed successfully",
        type: "success",
      })
    } catch (error) {
      console.error('Error removing expense:', error)
      showToast({
        message: "Failed to remove expense",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && expenses.length === 0) {
    return <Spinner />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addExpense} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount ({trip?.currency})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              required
              aria-required="true"
            />
          </div>
          <Button type="submit" disabled={isLoading}>Add Expense</Button>
        </form>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Expenses:</h3>
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between items-center">
                <span>{expense.description} - ({expense.category})</span>
                <div className="flex items-center space-x-2">
                  <CurrencyConverter amount={expense.amount} fromCurrency={trip?.currency || 'USD'} />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeExpense(expense.id)}
                    disabled={isLoading}
                    aria-label={`Remove expense: ${expense.description}`}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-bold text-lg flex justify-between items-center">
            <span>Total Expenses:</span>
            <CurrencyConverter amount={totalExpenses} fromCurrency={trip?.currency || 'USD'} />
          </div>
        </div>
      </CardContent>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </Card>
  )
}
