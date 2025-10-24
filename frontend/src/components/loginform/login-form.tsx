'use client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/hooks/useAuth";
import { setLogin } from "@/slice/authSlice";
import { useRouter } from "next/navigation";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

export function LoginForm({ className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email.includes("@")) return toast.error("Please enter a valid email address.");

    try {
      const result = await loginMutation(formData).unwrap();
      dispatch(setLogin({ token: result?.authToken }));
      toast.success("Login successful!");
      router.push("/notes");
    } catch (err) {
      toast.error("Login failed! Check credentials.");
      console.log(err);
    }
  };


  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-sm text-medium text-gray-600">
          Your secure gateway to organize thoughts
        </p>
      </div>

      {/* Form fields */}
      <div className="grid gap-6">
        {/* Email field */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="m@example.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => window.location.href="/auth/forgot-password"}
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
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

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full rounded-full bg-indigo-600 text-white shadow-md transition-all duration-300 
             hover:bg-indigo-700 hover:scale-101 hover:shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/auth/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
