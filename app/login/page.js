"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "../Actions/authCheck";

const LoginPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated and redirect if necessary
    checkAuthStatus({ protect: false, router });
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form data before sending login request
    const success = validateForm(formData);
    if (success === true) login(formData);
  };

  const validateForm = (formData) => {
    // Email must be present and valid format
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Email is invalid");
    // Password must be present and minimum 6 characters
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const login = async (formData) => {
    setIsLoggingIn(true);
    try {
      // Send login request to backend with credentials included
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      // Throw error if login failed to trigger catch block
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Show success message and navigate to admin dashboard on success
      toast.success("Logged in successfully!");
      router.push("/adminDashboard");
    } catch (err) {
      // Display login failure or network error message
      toast.error(err.message || "An error occurred");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Render nothing or loading UI on server to prevent hydration mismatch
  if (!isClient) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Users className="size-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Admin Log In</h1>
            <p className="text-gray-500">
              Welcome back! Please enter your credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-black">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-gray-400" />
              </div>
              <input
                type="email"
                autoComplete="email"
                className="w-full border border-gray-400 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-black">
                Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-gray-400" />
              </div>
              <input
                type={showPass ? "text" : "password"}
                className="w-full border border-gray-400 rounded-md px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password visibility" // Accessibility label for toggle button
              >
                {showPass ? (
                  <EyeOff className="size-5 text-gray-400" />
                ) : (
                  <Eye className="size-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-black rounded-md text-black hover:bg-black hover:text-white transition disabled:opacity-60"
            disabled={isLoggingIn}
            aria-busy={isLoggingIn} // Indicate loading state for assistive tech
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </span>
            ) : (
              "Log into Account"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-500">
            Don’t have an account?{" "}
            <Link href="/" className="underline text-black hover:text-gray-700">
              Go to Agent Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
