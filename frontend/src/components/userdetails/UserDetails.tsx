"use client";
import React, { useEffect, useState } from "react";
import { useChangePasswordMutation, useGetUserQuery, useUpdateUserMutation } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserDetailsSkeleton } from "../skeletons/UserSkeleton";
import { UserErrorScreen } from "./ErrorScreen";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const UserDetails = () => {
  const { data, error, isLoading } = useGetUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [formData, setFormData] = useState({ name: "", email: "", image: "" });
  const [showImageDialog, setShowImageDialog] = useState(false);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        image: data.image || "",
      });
    }
  }, [data]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleImageUpload = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "user_profile_pics"); 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dviey9itp/image/upload`, {
        method: "POST",
        body: uploadData,
      });

      const uploaded = await res.json();
      const newImageUrl = uploaded.secure_url;

      // 🔥 Instantly show the new image
      setFormData((prev) => ({ ...prev, image: newImageUrl }));

      // Also update user data in backend
      await updateUser({ ...formData, image: newImageUrl }).unwrap();

      toast.success("Profile photo updated!");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    }
  };

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.id]: e.target.value });
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await changePassword({
        oldPassword: password.currentPassword,
        newPassword: password.newPassword,
      }).unwrap();
      toast.success("Password updated successfully");
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  const router = useRouter();

  if (error) return <UserErrorScreen />;
  if (isLoading) return <UserDetailsSkeleton />;
  if (!data) return <p className="text-gray-500 text-center mt-10">No user data found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Details</h2>
        <Button
          variant="destructive"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/auth/login");
            toast.success("Logged out");
          }}
        >
          Logout
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-300 cursor-pointer">
                {formData.image ? (
                  <img
                    key={formData.image} // important for instant re-render
                    src={formData.image}
                    alt="Profile"
                    className="h-full w-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl font-bold">
                    {data?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowImageDialog(true)}>
                 View Photo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = async (e: any) => {
                    const file = e.target.files[0];
                    if (file) await handleImageUpload(file);
                  };
                  input.click();
                }}
              >
                Edit Photo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">{formData.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Full Name
            </label>
            <Input id="name" type="text" value={formData.name} onChange={handleProfileChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Email
            </label>
            <Input id="email" type="email" value={formData.email} onChange={handleProfileChange} />
          </div>

          <Button
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
            disabled={isUpdating}
            type="submit"
          >
            {isUpdating ? "Saving..." : "Save Details"}
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <Input
            id="currentPassword"
            type="password"
            placeholder="Current Password"
            value={password.currentPassword}
            onChange={handlePasswordChange}
            required
          />
          <Input
            id="newPassword"
            type="password"
            placeholder="New Password"
            value={password.newPassword}
            onChange={handlePasswordChange}
            required
          />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={password.confirmPassword}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            disabled={isChanging}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            {isChanging ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>

      {/* View Photo Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Photo</DialogTitle>
          </DialogHeader>
          {formData.image ? (
            <img
              src={formData.image}
              alt="Profile"
              className="rounded-lg w-full h-auto object-cover"
            />
          ) : (
            <p className="text-gray-500 text-center">No profile photo</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
