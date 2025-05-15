"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Loader2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { checkAuthStatus } from "@/app/Actions/authCheck";

const SignupPage = () => {
  const [isClient, setIsClient] = useState(false); // Prevent SSR hydration issues by rendering form only on client
  const [showPass, setShowPass] = useState(false); // Toggle password visibility for better UX
  const [isSigningUp, setIsSigningUp] = useState(false); // Manage signup button loading state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const router = useRouter();

  useEffect(() => {
    checkAuthStatus({ protect: true, router }); // Redirect if user already authenticated
    setIsClient(true); // Mark as client after mount to avoid hydration mismatch
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateForm(formData);
    if (valid === true) signup(formData); // Proceed with signup only if validation passes
  };

  const validateForm = (data) => {
    if (!data.fullName.trim()) return toast.error("Full Name is required"); // Validate Full Name presence
    if (!data.email.trim()) return toast.error("Email is required"); // Validate Email presence
    if (!/\S+@\S+\.\S+/.test(data.email))
      return toast.error("Email is invalid"); // Validate Email format
    if (!data.phone.trim()) return toast.error("Phone number is required"); // Validate Phone presence
    if (!/^\+?[1-9]\d{7,14}$/.test(data.phone))
      return toast.error("Phone number is invalid"); // Validate Phone format (E.164)
    if (!data.password.trim()) return toast.error("Password is required"); // Validate Password presence
    if (data.password.length < 6)
      return toast.error("Password must be at least 6 characters"); // Enforce minimum password length
    return true;
  };

  const signup = async (formData) => {
    setIsSigningUp(true); // Set loading state on signup
    try {
      const res = await fetch("/api/saveAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed"); // Handle API errors gracefully

      toast.success("Account created successfully!"); // Notify user of successful signup
      router.push("/"); // Redirect to homepage after signup
    } catch (err) {
      toast.error(err.message || "An error occurred"); // Show error toast on failure
    } finally {
      setIsSigningUp(false); // Reset loading state after signup attempt
    }
  };

  if (!isClient) return <div>Loading...</div>; // Avoid rendering form until client-side

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <UserPlus className="size-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Sign Up</h1>
            <p className="text-gray-500">Create a new Agent account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
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

          {/* Phone Number */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-black">Phone</span>
            </label>
            <PhoneInput
              country={"in"}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              inputClass="!w-full !border !border-gray-400 !rounded-md !px-4 !py-2 !text-black"
              inputStyle={{ width: "100%" }}
            />
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
              >
                {showPass ? (
                  <EyeOff className="size-5 text-gray-400" />
                ) : (
                  <Eye className="size-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-black rounded-md text-black hover:bg-black hover:text-white transition disabled:opacity-60"
            disabled={isSigningUp} // Disable button to prevent duplicate submissions
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
