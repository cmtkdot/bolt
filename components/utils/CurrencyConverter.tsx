import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

interface CurrencyConverterProps {
  className?: string
  initialAmount?: number
  initialFromCurrency?: string
  initialToCurrency?: string
  autoConvert?: boolean
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  // Add more currencies as needed
]

const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_API_KEY || 'cur_live_6TsCdK0AWxCaG2kwtaqlfP5VaeaEYxrStkpehvFA'
const API_BASE_URL = 'https://api.currencyapi.com/v3'

export default function CurrencyConverter({ 
  className = '', 
  initialAmount, 
  initialFromCurrency = 'USD', 
  initialToCurrency,
  autoConvert = false
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState<number | null>(initialAmount || null)
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency)
  const [toCurrency, setToCurrency] = useState(initialToCurrency || 'EUR')
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (autoConvert && amount !== null) {
      handleConvert()
    }
  }, [amount, fromCurrency, toCurrency, autoConvert])

  const handleConvert = async () => {
    if (amount === null) {
      setError('Please enter an amount')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_BASE_URL}/latest`, {
        params: {
          apikey: API_KEY,
          base_currency: fromCurrency,
          currencies: toCurrency,
        },
      })

      const rate = response.data.data[toCurrency].value
      const converted = amount * rate
      setConvertedAmount(converted)
    } catch (err) {
      console.error('Error converting currency:', err)
      setError('Failed to convert currency. Please try again.')
      setConvertedAmount(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code
  }

  const formatAmount = (value: number | null) => {
    if (value === null) return 'N/A'
    return value.toFixed(2)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount || ''}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
          className="w-[150px]"
        />
        <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={autoConvert}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="From" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>=</span>
        <Select value={toCurrency} onValueChange={setToCurrency} disabled={autoConvert}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="To" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!autoConvert && (
          <Button onClick={handleConvert} disabled={isLoading}>
            Convert
          </Button>
        )}
      </div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : convertedAmount !== null ? (
        <p className="font-semibold">
          {formatAmount(amount)} {getCurrencySymbol(fromCurrency)} = {formatAmount(convertedAmount)} {getCurrencySymbol(toCurrency)}
        </p>
      ) : null}
    </div>
  )
}
