'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function PreferencesPage() {
  const [defaultCurrency, setDefaultCurrency] = useState('USD')
  const [preferredUnits, setPreferredUnits] = useState('metric')
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      fetchPreferences()
    }
  }, [user])

  const fetchPreferences = async () => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user?.id)
      .single()

    if (error) {
      console.error('Error fetching preferences:', error)
    } else if (data) {
      setDefaultCurrency(data.default_currency)
      setPreferredUnits(data.preferred_units)
    }
  }

  const savePreferences = async () => {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user?.id,
        default_currency: defaultCurrency,
        preferred_units: preferredUnits
      })

    if (error) {
      console.error('Error saving preferences:', error)
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Your preferences have been saved.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Preferences</h1>
      <Card>
        <CardHeader>
          <CardTitle>Set Your Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-2">Default Currency</label>
            <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-2">Preferred Units</label>
            <Select value={preferredUnits} onValueChange={setPreferredUnits}>
              <SelectTrigger>
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric</SelectItem>
                <SelectItem value="imperial">Imperial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={savePreferences}>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}