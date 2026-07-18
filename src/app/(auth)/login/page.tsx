"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, } from "lucide-react";
import { SiDavinciresolve } from "react-icons/si";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(from);
      router.refresh();
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
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 lg:p-16">
        {/* Header Logo */}
        <Link href="/" className="flex flex-col items-start mb-8 md:mb-0">
          <div className="flex items-center space-x-2">
            <SiDavinciresolve className="h-5 w-5 text-blue-900 dark:text-blue-450 shrink-0" />
            <span className="text-xl font-black tracking-wider text-blue-900 dark:text-blue-450">
              RIVA<span className="text-red-600 dark:text-red-500">RESOLVE</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Built by <span className="font-semibold text-slate-500 dark:text-slate-400">Godspower Aghorunse</span>
          </span>
        </Link>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tighter text-blue-900 font-heading">
              Welcome Back!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your email and password to access your account.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                  {error}
                </div>
              )}

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

              {/* Remember Me and Forgot Password */}
              

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow font-semibold py-6 rounded-lg text-sm transition-all duration-150 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log In"}
              </Button>
            </form>
          </Form>


          {/* Register Redirect */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t Have An Account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-900 hover:underline dark:text-blue-455"
            >
              Register Now.
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 mt-8">
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
              Effortlessly manage your team and operations.
            </h2>
            <p className="text-sm text-blue-200/80 leading-relaxed">
              Log in to access your RIVARESOLVE dashboard, submit maintenance tickets, assign technician tasks, and keep the campus upkeep resolved instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
        Loading Login Portal...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
