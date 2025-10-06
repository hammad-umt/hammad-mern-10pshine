'use client'
import { useChangePasswordMutation, useGetUserQuery, useUpdateUserMutation } from '@/hooks/useAuth'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { UserDetailsSkeleton } from '../skeletons/UserSkeleton'
import { UserErrorScreen } from './ErrorScreen'

export const UserDetails = () => {
  const { data, error, isLoading } = useGetUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })
  console.log(data);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
      })
    }
  }, [data])

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = updateUser(formData).unwrap();
      toast.success("User details updated successfully");
    } catch (error) {
      toast.error("Error occured while updating");
    }
  }

  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.id]: e.target.value })
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.newPassword !== password.confirmPassword) {
      toast.error("Passwords do not match ❌")
      return
    }
    try {
      const res = await changePassword({
        oldPassword: password.currentPassword,
        newPassword: password.newPassword
      }).unwrap()
      toast.success("Password updated ")
      console.log(res)
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      toast.error("Failed to update password ")
      console.log(err)
    }
  }
  const router = useRouter();
  if (error) 
  {
    return <UserErrorScreen />
    }  if (isLoading) 
  {
    return <UserDetailsSkeleton />
  }
  if (!data) return <p className="text-gray-500 text-center mt-10">No user data found</p>

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 space-y-8">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Details</h2>
        <Button
          variant="destructive"
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/auth/login')
            toast.success("Logged out")
          }}
        >
          Logout
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Profile Overview</h2>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
            {data?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">{data?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{data?.email}</p>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Personal Details</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Full Name
            </label>
            <Input id="name" type="text" value={formData.name} onChange={handleProfileChange} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Email Address
            </label>
            <Input id="email" type="email" value={formData.email} onChange={handleProfileChange} />
          </div>
          <Button
            disabled={isUpdating}
            type="submit">{isUpdating ? "Saving ..." : "Save Details"}</Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Password
            </label>
            <Input required id="currentPassword" type="password" value={password.currentPassword} onChange={handlePasswordChange} />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              New Password
            </label>
            <Input required id="newPassword" type="password" value={password.newPassword} onChange={handlePasswordChange} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Confirm New Password
            </label>
            <Input id="confirmPassword" type="password" value={password.confirmPassword} onChange={handlePasswordChange} />
          </div>
          <Button type="submit" disabled={isChanging}>
            {isChanging ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
