'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Plus, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Todo {
  id: string
  user_id: string
  text: string
  completed: boolean
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { register, handleSubmit, reset } = useForm<{ text: string }>()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .is('trip_id', null)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load todo list",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTodo = async (data: { text: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data: newTodo, error } = await supabase
        .from('todos')
        .insert({ user_id: user.id, text: data.text, completed: false })
        .select()
        .single()

      if (error) throw error
      setTodos([...todos, newTodo])
      reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      })
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id)
      if (!todoToUpdate) return

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todoToUpdate.completed })
        .eq('id', id)

      if (error) throw error
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>General Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(addTodo)} className="flex space-x-2 mb-4">
            <Input
              {...register('text', { required: true })}
              placeholder="Add a new todo"
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4"
                />
                <span className={todo.completed ? 'line-through' : ''}>
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}