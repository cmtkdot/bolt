import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProfileFormProps {
  user: any
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { register, handleSubmit } = useForm({ defaultValues: user })

  const onSubmit = (data: any) => {
    // In a real app, you'd send this data to your backend
    console.log('Updated profile data:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name', { required: true })} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email', { required: true })} />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  )
}