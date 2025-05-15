// Import necessary modules for response and cookie handling
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Handle POST request for logging out the user
export async function POST() {
  try {
    // Access the cookie store
    const cookieStore = cookies();

    // Retrieve the JWT token from cookies
    const token = cookieStore.get("token")?.value;

    // If no token found, respond with unauthorized
    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    // Clear the token by setting it with an expired maxAge
    cookieStore.set({
      name: "token",
      value: "",
      maxAge: 0, // Immediately expire the cookie
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Respond with a success message
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    // Log and return internal server error if logout fails
    console.error("Logout Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
