'use client'

import React, { useState } from 'react'
import LoginForm from './LoginForm'

type AuthFormProps = {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [currentMode, setCurrentMode] = useState(mode)

  return (
    <div>
      {mode === 'login' ? (
        <LoginForm />
      ) : (
        <div>Sign Up form not implemented yet</div>
        // Implement SignUpForm or use the same form for both login and signup
      )}
    </div>
  )
}
