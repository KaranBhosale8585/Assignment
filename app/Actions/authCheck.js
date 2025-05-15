"use client";

// Checks user authentication status and redirects based on protection rules
export const checkAuthStatus = async ({ protect = false, router }) => {
  try {
    // Call backend API to verify if user is logged in (with cookies)
    const res = await fetch("/api/auth/checkAuth", {
      method: "GET",
      credentials: "include", // include cookies for session/token
    });

    // Parse response only if status is OK
    const data = res.ok ? await res.json() : null;

    // Determine if user is logged in based on userId presence
    const isLoggedIn = !!data?.userId;

    // If page is protected and user is not logged in, redirect to login
    if (protect && !isLoggedIn) {
      router.push("/login");
    }
    // If page is public and user is logged in, redirect to home/dashboard
    else if (!protect && isLoggedIn) {
      router.push("/");
    }

    // Return current login status (true/false)
    return isLoggedIn;
  } catch (error) {
    // Log error and redirect to login if protection is required
    console.error("Auth check failed:", error.message);
    if (protect) router.push("/login");
    return false;
  }
};
