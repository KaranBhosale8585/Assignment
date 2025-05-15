"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Loader2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "../Actions/authCheck";

const SignupPage = () => {
  // Track if component is mounted client-side to avoid SSR issues
  const [isClient, setIsClient] = useState(false);
  // Toggle password visibility for password and confirm password inputs
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  // Manage loading state for async signup process
  const [isSigningUp, setIsSigningUp] = useState(false);
  // Form data state management for controlled inputs
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated to redirect or allow access
    checkAuthStatus({ protect: false, router });
    setIsClient(true); // Mark component as mounted on client
  }, []);

  // Validate form fields before submitting
  const validateForm = (data) => {
    if (!data.fullName.trim()) return toast.error("Full Name is required");
    if (!data.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(data.email))
      return toast.error("Email is invalid");
    if (!data.password.trim()) return toast.error("Password is required");
    if (data.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (data.password !== data.confirmPassword)
      return toast.error("Passwords do not match");
    return true;
  };

  // Handle form submission with async signup call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateForm(formData);
    if (valid === true) signup(formData);
  };

  // Call backend API to create a new user account
  const signup = async (formData) => {
    setIsSigningUp(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast.success("Account created successfully!");
      router.push("/"); // Redirect to homepage or dashboard after signup
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSigningUp(false);
    }
  };

  if (!isClient) return <div>Loading...</div>; // Render nothing on server to avoid hydration mismatch

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Signup header with icon */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <UserPlus className="size-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Sign Up</h1>
            <p className="text-gray-500">Create a new account to continue.</p>
          </div>
        </div>

        {/* Signup form controlled inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-black">
                Full Name
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserPlus className="size-5 text-gray-400" />
              </div>
              <input
                type="text"
                autoComplete="name"
                className="w-full border border-gray-400 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email Input */}
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

          {/* Password Input */}
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
              {/* Toggle password visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <EyeOff className="size-5 text-gray-400" />
                ) : (
                  <Eye className="size-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-black">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPass ? "text" : "password"}
                className="w-full border border-gray-400 rounded-md px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              {/* Toggle confirm password visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? (
                  <EyeOff className="size-5 text-gray-400" />
                ) : (
                  <Eye className="size-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button with loading state */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-black rounded-md text-black hover:bg-black hover:text-white transition disabled:opacity-60"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Link to Login page for existing users */}
        <div className="text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline text-black hover:text-gray-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
