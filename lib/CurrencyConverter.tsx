import React, { useState, useEffect } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getCurrencyByCountry, convertCurrency, commonCurrencies } from './currencyUtils'
import { createClient } from '@supabase/supabase-js'

interface CurrencyConverterProps {
  initialAmount: number
  initialFromCurrency: string
  initialToCurrency: string
  autoConvert?: boolean
  className?: string
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  initialAmount,
  initialFromCurrency,
  initialToCurrency,
  autoConvert = false,
  className = '',
}) => {
  const [amount, setAmount] = useState(initialAmount.toString())
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency)
  const [toCurrency, setToCurrency] = useState(initialToCurrency)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tripDestinations, setTripDestinations] = useState<string[]>([])
  const [relevantCurrencies, setRelevantCurrencies] = useState<string[]>([])

  useEffect(() => {
    fetchTripDestinations()
  }, [])

  useEffect(() => {
    if (tripDestinations.length > 0) {
      const currencies = tripDestinations
        .map(destination => getCurrencyByCountry(destination))
        .filter((currency): currency is string => currency !== null)
      setRelevantCurrencies([...new Set([...currencies, ...commonCurrencies])])
    }
  }, [tripDestinations])

  useEffect(() => {
    if (autoConvert) {
      handleConvert()
    }
  }, [amount, fromCurrency, toCurrency, autoConvert])

  const fetchTripDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('destination')
      if (error) throw error
      setTripDestinations(data.map(trip => trip.destination))
    } catch (err) {
      console.error('Error fetching trip destinations:', err)
      setError('Failed to fetch trip destinations')
    }
  }

  const handleConvert = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await convertCurrency(parseFloat(amount), fromCurrency, toCurrency)
      setConvertedAmount(result)
    } catch (err) {
      setError('Failed to convert currency. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <Select
        value={fromCurrency}
        onValueChange={(value) => setFromCurrency(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="From Currency" />
        </SelectTrigger>
        <SelectContent>
          {relevantCurrencies.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={toCurrency}
        onValueChange={(value) => setToCurrency(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="To Currency" />
        </SelectTrigger>
        <SelectContent>
          {relevantCurrencies.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!autoConvert && (
        <Button onClick={handleConvert} disabled={isLoading}>
          {isLoading ? 'Converting...' : 'Convert'}
        </Button>
      )}
      {convertedAmount !== null && (
        <p>
          {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default CurrencyConverter
