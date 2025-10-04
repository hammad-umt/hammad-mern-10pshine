'use client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setLogin } from "@/slice/authSlice";
import { useRouter } from "next/navigation";
import { useSingUpMutation } from "@/hooks/useAuth";

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
      router.push('/userDetails');
    } catch (err) {
      toast.error("Signup failed! Try again.");
      console.log(err);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to get started
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="m@example.com" required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>  
           {isLoading ? "Signing up..." : "Sign Up"} 
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/auth/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}
