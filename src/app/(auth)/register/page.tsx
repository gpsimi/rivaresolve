"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { SiDavinciresolve } from "react-icons/si";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  role: z.enum(["STUDENT_STAFF", "MAINTENANCE_OFFICER"], { error: "Role is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT_STAFF",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess("Account registered successfully! Redirecting to login...");
      form.reset();

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white dark:bg-slate-950 font-sans">
      {/* Left Column: Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 lg:p-16 overflow-y-auto">
        {/* Header Logo */}
        <div className="flex flex-col items-start mb-6 md:mb-0">
          <div className="flex items-center space-x-2">
            <SiDavinciresolve className="h-5 w-5 text-blue-900 dark:text-blue-450 shrink-0" />
            <span className="text-xl font-black tracking-wider text-blue-900 dark:text-blue-450">
              RIVA<span className="text-red-600 dark:text-red-500">RESOLVE</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Built by <span className="font-semibold text-slate-500 dark:text-slate-400">Godspower Aghorunse</span>
          </span>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto space-y-5 py-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tighter text-blue-900 font-heading">
              Create an Account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign up to report maintenance issues and track requests.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 pt-1">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 border border-green-100 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-400">
                  {success}
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 dark:text-slate-350 font-semibold text-xs uppercase tracking-wider">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={loading}
                        className="w-full border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 rounded-lg focus-visible:ring-blue-900 dark:focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 dark:text-slate-355 font-semibold text-xs uppercase tracking-wider">
                      Account Type
                    </FormLabel>
                    <FormControl>
                      <select
                        disabled={loading}
                        className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-transparent dark:text-slate-200"
                        {...field}
                      >
                        <option value="STUDENT_STAFF" className="dark:bg-slate-900">Student or Staff</option>
                        <option value="MAINTENANCE_OFFICER" className="dark:bg-slate-900">Maintenance Officer</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 dark:text-slate-350 font-semibold text-xs uppercase tracking-wider">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@riva.edu.ng"
                        disabled={loading}
                        className="w-full border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 rounded-lg focus-visible:ring-blue-900 dark:focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 dark:text-slate-350 font-semibold text-xs uppercase tracking-wider">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={loading}
                          className="w-full border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 pr-10 rounded-lg focus-visible:ring-blue-900 dark:focus-visible:ring-blue-500"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 dark:text-slate-350 font-semibold text-xs uppercase tracking-wider">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={loading}
                          className="w-full border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 pr-10 rounded-lg focus-visible:ring-blue-900 dark:focus-visible:ring-blue-500"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow font-semibold py-6 rounded-lg text-sm transition-all duration-150 cursor-pointer mt-2"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>


          {/* Login Redirect */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already Have An Account?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-900 hover:underline dark:text-blue-455"
            >
              Sign In.
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          <p>© Copyright 2026 RIVA Open University. All Rights Reserved.</p>
        </div>
      </div>

      {/* Right Column: Branding Showcase Panel */}
      <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 p-8 lg:p-12 items-center justify-center relative overflow-hidden">
        {/* Overlapping abstract background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-lg w-full space-y-8 z-10 flex flex-col">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Effortlessly report faults and track tickets in real-time.
            </h2>
            <p className="text-sm text-blue-200/80 leading-relaxed">
              Create an account to report broken furniture, faulty lights, plumbing issues, or damaged equipment. Receive real-time maintenance updates and tracking details on your RIVARESOLVE portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
