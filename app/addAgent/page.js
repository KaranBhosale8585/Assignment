"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { checkAuthStatus } from "@/app/Actions/authCheck";
import Header from "@/components/AdminHeader";

const AddAgentPage = () => {
  const [isClient, setIsClient] = useState(false); // Detect client-side rendering to avoid SSR issues
  const [showPass, setShowPass] = useState(false); // Toggle password visibility
  const [isAddingUp, setIsAddingUp] = useState(false); // Loading state during agent creation
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const router = useRouter();

  useEffect(() => {
    // Protect route: redirect if not authenticated
    checkAuthStatus({ protect: true, router });
    setIsClient(true);
  }, []);

  // Validate inputs before submitting form
  const validateForm = (data) => {
    if (!data.fullName.trim()) return toast.error("Full Name is required");
    if (!data.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(data.email))
      return toast.error("Email is invalid");
    if (!data.phone.trim()) return toast.error("Phone number is required");
    if (!/^\+?[1-9]\d{7,14}$/.test(data.phone))
      return toast.error("Phone number is invalid");
    if (!data.password.trim()) return toast.error("Password is required");
    if (data.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  // Handles form submission and calls backend API to save agent
  const AddAgent = async (formData) => {
    setIsAddingUp(true);
    try {
      const res = await fetch("/api/saveAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast.success("Account created successfully!");
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsAddingUp(false);
    }
  };

  // Form submit handler: validate and submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateForm(formData);
    if (valid === true) AddAgent(formData);
  };

  if (!isClient) return <div>Loading...</div>; // Prevent rendering on server

  return (
    <>
      <Header /> {/* Admin header/navigation */}
      <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Page header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <UserPlus className="size-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Add Agent</h1>
              <p className="text-gray-500">Create a new Agent account.</p>
            </div>
          </div>

          {/* Agent creation form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name input */}
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

            {/* Email input */}
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

            {/* Phone number input with country code */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-black">Phone</span>
              </label>
              <PhoneInput
                country={"in"} // Default to India
                value={formData.phone}
                onChange={(phone) => setFormData({ ...formData, phone })}
                inputClass="!w-full !border !border-gray-400 !rounded-md !px-4 !pl-11 !py-2 !text-black"
                inputStyle={{ width: "100%" }}
              />
            </div>

            {/* Password input with show/hide toggle */}
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
                  aria-label="Toggle password visibility"
                >
                  {showPass ? (
                    <EyeOff className="size-5 text-gray-400" />
                  ) : (
                    <Eye className="size-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button with loading state */}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-black rounded-md text-black hover:bg-black hover:text-white transition disabled:opacity-60"
              disabled={isAddingUp}
            >
              {isAddingUp ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  Adding Agent...
                </span>
              ) : (
                "Create Agent"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAgentPage;
