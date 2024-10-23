"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { MessageCircle, Send, X } from "lucide-react"

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (input.trim()) {
      const newMessage: Message = { id: Date.now(), text: input, sender: "user" }
      setMessages([...messages, newMessage])
      setInput("")
      // In a real app, you would send the message to an AI service here
      setTimeout(() => {
        const aiResponse: Message = { id: Date.now(), text: "I'm an AI assistant. How can I help you with your travel plans?", sender: "ai" }
        setMessages(prevMessages => [...prevMessages, aiResponse])
      }, 1000)
    }
  }

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full p-4"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 sm:w-96">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI Travel Assistant</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block rounded-lg px-3 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={sendMessage} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
