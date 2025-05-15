"use client";

import { useRouter } from "next/navigation";
import {
  UserPlus,
  SendHorizonal,
  LogOut,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { checkAuthStatus } from "@/app/Actions/authCheck";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Check user authentication on component mount, redirect if unauthorized
  useEffect(() => {
    checkAuthStatus({ protect: true, router });
  }, [router]);

  // Logout handler calls API to clear session and redirects to home page
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies/session tokens are sent
      });

      if (response.ok) {
        router.push("/"); // Redirect after successful logout
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message);
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <header className="px-4 py-3 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Logo with click to navigate to admin dashboard */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <ShieldCheck
              className="w-6 h-6 hover:cursor-pointer"
              onClick={() => router.push("/adminDashboard")}
            />
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-wide">
            ACM Admin Panel
          </h1>
        </div>

        {/* Hamburger menu button visible only on small screens */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop menu buttons hidden on mobile */}
        <div className="hidden md:flex gap-4 items-center">
          <button
            onClick={() => router.push("/addAgent")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Agent
          </button>

          <button
            onClick={() => router.push("/sendLeads")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            <SendHorizonal className="w-4 h-4" />
            Send Leads
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile menu, shown only when menuOpen is true */}
      {menuOpen && (
        <div className="mt-4 flex flex-col gap-3 md:hidden">
          <button
            onClick={() => {
              router.push("/addAgent");
              setMenuOpen(false); // Close menu after navigation
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Agent
          </button>

          <button
            onClick={() => {
              router.push("/sendLeads");
              setMenuOpen(false); // Close menu after navigation
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            <SendHorizonal className="w-4 h-4" />
            Send Leads
          </button>

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false); // Close menu after logout
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
