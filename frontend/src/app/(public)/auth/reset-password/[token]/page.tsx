'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useResetPasswordMutation } from '@/hooks/useAuth'
// import { useResetPasswordMutation } from '@/hooks/useAuth'  // (if you already have RTK query hook)

export default function ResetPasswordPage({ className }: { className?: string }) {
  const { token } = useParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [resetPassword, { isLoading: mutationLoading }] = useResetPasswordMutation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!token) {
      toast.error('Invalid reset token.')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    try {
      setIsLoading(true)
      const res = await resetPassword({ token: token.toString(), newPassword: password }).unwrap()
      if (!res) throw new Error('Failed to reset password')
      toast.success('Password reset successfully.')
      router.push('/auth/login')
    } catch {
      toast.error('This reset link is invalid or has expired.')
    } finally {
      setIsLoading(false)
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
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter and confirm your new password below.
          </p>
        </div>

        {/* New Password */}
        <div className="grid gap-3">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>

        <div className="text-center text-sm">
          <a href="/auth/login" className="underline underline-offset-4">
            Back to Login
          </a>
        </div>
      </form>
    </div>
  )
}
