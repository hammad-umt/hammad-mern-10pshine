'use client'

import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useForgotPasswordMutation } from '@/hooks/useAuth'

export default function ForgotPasswordPage({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [forgotPassword, { isLoading: isApiLoading }] = useForgotPasswordMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      const res = await forgotPassword({ email }).unwrap()
      console.log(res)
      toast.success('Password reset link sent to your email')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Try again later.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className={cn(
          'w-full max-w-sm space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md',
          className
        )}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email address and we’ll send you a reset link.
          </p>
        </div>

        {/* Email input */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
          disabled={isApiLoading}
        >
          {isApiLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        {/* Footer */}
        <div className="text-center text-sm">
          <a href="/auth/login" className="underline underline-offset-4">
            Back to Login
          </a>
        </div>
      </form>
    </div>
  )
}
