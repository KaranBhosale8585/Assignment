// Import required modules and utilities
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/utils";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Handle POST request for user signup
export async function POST(req) {
  try {
    // Parse request body to extract user input
    const body = await req.json();
    const { fullName, email, password } = body;

    // Establish connection to the database
    await connectDB();

    // Validate required fields
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the user's password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token using the user's ID
    const token = generateToken(newUser._id);

    // Create a response with the new user's basic data
    const response = NextResponse.json(
      {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      { status: 201 }
    );

    // Set the JWT token in an HTTP-only cookie for authentication
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true, // Prevent access from client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      path: "/", // Cookie available throughout the app
      maxAge: 7 * 24 * 60 * 60, // Cookie expires in 7 days
    });

    return response;
  } catch (error) {
    // Log and handle any server errors
    console.error("Signup Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
