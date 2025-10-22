'use client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setLogin } from "@/slice/authSlice";
import { useRouter } from "next/navigation";
import { useSingUpMutation } from "@/hooks/useAuth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupForm({ className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const [signupMutation, { isLoading }] = useSingUpMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const result = await signupMutation(formData).unwrap();
      dispatch(setLogin({ token: result?.authToken }));
      toast.success("Signup successful!");
      router.push("/notes");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Signup failed! Please try again.";
      toast.error(errorMessage);
      console.log("Signup error:", err);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your details below to get started
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="m@example.com"
            required
          />
        </div>

        {/* Password Field */}
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-full bg-indigo-600 text-white font-medium shadow-md transition-all duration-300 hover:bg-indigo-700 hover:scale-105 hover:shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing up...
            </div>
          ) : (
            "Sign Up"
          )}
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
