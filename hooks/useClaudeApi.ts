'use client'

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useClaudeApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Message[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude API');
      }

      const data = await response.json();
      setIsLoading(false);
      return data.content[0].text;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
      return null;
    }
  };

  return { sendMessage, isLoading, error };
}