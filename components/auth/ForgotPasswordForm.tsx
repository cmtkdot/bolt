'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '../../lib/auth'

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        setError(null)
        setIsLoading(true)

        try {
            const { error } = await resetPassword(email)
            if (error) {
                setError(error.message)
            } else {
                setMessage('Password reset instructions have been sent to your email.')
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email-address" className="sr-only">
                    Email address
                </label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            {message && (
                <div className="text-green-500 text-sm mt-2">{message}</div>
            )}

            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Reset Password'}
                </button>
            </div>
            <div className="text-center mt-4">
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Back to Login
                </Link>
            </div>
        </form>
    )
}
