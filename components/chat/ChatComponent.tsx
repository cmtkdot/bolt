'use client';

import React, { useState } from 'react';
import { useClaudeApi } from '@/hooks/useClaudeApi';

export const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const { sendMessage, isLoading, error } = useClaudeApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const response = await sendMessage(newMessages);
    if (response) {
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 h-80 overflow-y-auto border rounded p-2">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border rounded-l p-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r" disabled={isLoading}>
          Send
        </button>
      </form>
      {isLoading && <p className="mt-2 text-gray-500">Loading...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};
