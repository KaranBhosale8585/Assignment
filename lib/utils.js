import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // Importing cookies from next/headers to manage cookies

const MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// Generates a JWT token containing the userId with expiration
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
};

// Verifies JWT token from cookies and returns the decoded userId or null
export const verifyToken = () => {
  try {
    const cookieStore = cookies();
    // Replace 'token' below with your actual cookie name for the JWT token
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId };
  } catch (err) {
    console.error("Token error:", err.message);
    return null;
  }
};
