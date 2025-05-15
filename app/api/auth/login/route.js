// Import required modules and utilities
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/utils";
import { NextResponse } from "next/server";

// Handle POST request for user login
export async function POST(req) {
  // Parse the request body to extract email and password
  const body = await req.json();
  const { email, password } = body;
  try {
    // connect to the database
    await dbConnect();

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // if user not exists, return invalid credentials
      return new NextResponse(
        JSON.stringify({ message: "Invalid credentials" }),
        {
          status: 400,
        }
      );
    }

    // Compare the provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If password doesn't match, return invalid credentials
      return new NextResponse(
        JSON.stringify({ message: "Invalid credentials" }),
        {
          status: 400,
        }
      );
    }

    // Prepare success response with user data (excluding password)
    const res = new NextResponse(
      JSON.stringify({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      }),
      { status: 200 }
    );

    // Generate JWT token and set it as an HTTP-only cookie
    const token = generateToken(user._id);
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === "production", // Secure in production
      path: "/", // Accessible throughout the site
    });

    return res;
  } catch (error) {
    // Handle unexpected errors
    console.error("Login Error:", error.message);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}
