// Import necessary modules for response, JWT handling, and cookie access
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Handle GET request to check user authentication status
export async function GET() {
  try {
    // Retrieve the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    // If no token is found, respond with null userId
    if (!token) {
      return NextResponse.json({ userId: null }, { status: 200 });
    }
    // Verify and decode the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid, respond with the userId from the token
    return NextResponse.json({ userId: decoded.userId }, { status: 200 });
  } catch (err) {
    // Log any error and return null userId for failed authentication
    console.error("Auth check error:", err.message);
    return NextResponse.json({ userId: null }, { status: 200 });
  }
}
