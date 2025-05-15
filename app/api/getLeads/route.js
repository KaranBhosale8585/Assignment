// Import Next.js response utility and required modules
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";

// Handle GET request to fetch all leads
export async function GET(req) {
  // Establish database connection
  await dbConnect();

  try {
    // Fetch all leads and populate the assigned agent's full name
    const leads = await Lead.find().populate("assignedTo", "fullName");

    // If no leads found, return a 404 response
    if (leads.length === 0) {
      return NextResponse.json({ message: "No leads found." }, { status: 404 });
    }

    // Return leads data with 200 status
    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    // Log error and return internal server error response
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { message: "Error fetching leads", error: error.message },
      { status: 500 }
    );
  }
}
