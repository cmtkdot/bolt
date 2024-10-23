import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState<number | null>(null)
  const [currencies, setCurrencies] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`)
      const data = await response.json()
      if (data.result === 'success') {
        setCurrencies(data.supported_codes.map((code: string[]) => code[0]))
      } else {
        throw new Error('Failed to fetch currencies')
      }
    } catch (err) {
      console.error('Error fetching currencies:', err)
      setError('Failed to fetch currencies')
    }
  }

  const handleConvert = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`)
      const data = await response.json()
      if (data.result === 'success') {
        setResult(data.conversion_result)
      } else {
        throw new Error('Failed to convert currency')
      }
    } catch (err) {
      console.error('Error converting currency:', err)
      setError('Failed to convert currency')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-grow">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
        </div>
        <Select value={fromCurrency} onValueChange={setFromCurrency}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="From" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(currency => (
              <SelectItem key={currency} value={currency}>{currency}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ArrowRight className="h-10 w-10" />
        <Select value={toCurrency} onValueChange={setToCurrency}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="To" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(currency => (
              <SelectItem key={currency} value={currency}>{currency}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleConvert} disabled={isLoading} className="w-full">
        {isLoading ? 'Converting...' : 'Convert'}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {result !== null && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-center">
              {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}