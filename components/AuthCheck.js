"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthCheck({ protect = false }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call backend API to check authentication status with cookies included
        const res = await fetch("/api/auth/checkAuth", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        const isLoggedIn = res.ok && data?.userId;

        if (protect) {
          // For protected routes, redirect to login if user is not authenticated
          if (!isLoggedIn) {
            router.push("/login");
          }
        } else {
          // For public routes, redirect to admin dashboard if already authenticated
          if (isLoggedIn) {
            router.push("/adminDashboard");
          }
        }
      } catch (err) {
        // On error, log and redirect to login if route is protected
        console.error("Auth check failed:", err.message);
        if (protect) router.push("/login");
      } finally {
        // Mark auth check as completed to control rendering if needed
        setChecking(false);
      }
    };

    checkAuth();
  }, [protect, router]);

  // No UI rendered by this component, used purely for redirect logic
  return null;
}
