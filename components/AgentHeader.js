"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, LogIn, ShieldUser } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-200">
      {/* Logo with clickable icon that routes to the home page */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
          <ShieldCheck
            className="w-6 h-6 hover:cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
        {/* Brand name displayed prominently */}
        <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
          ACM Agent Panel
        </h1>
      </div>

      {/* Login button with icon, navigates to login page */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
        >
          <ShieldUser />
          Log In
        </button>
      </div>
    </header>
  );
}
