// Import database connection and Agent model
import dbConnect from "@/lib/db";
import Agent from "@/models/Agent";
import { NextResponse } from "next/server";

// Handle DELETE request to remove an agent by ID
export async function DELETE(req, { params }) {
  const { id } = params; // Extract agent ID from route parameters

  try {
    await dbConnect(); // Connect to the database

    // Attempt to delete the agent by ID
    await Agent.findByIdAndDelete(id);

    // Respond with success message
    return NextResponse.json({ message: "Agent deleted successfully" });
  } catch (error) {
    // Handle and log any errors during deletion
    return NextResponse.json(
      { message: "Failed to delete agent", error: error.message },
      { status: 500 }
    );
  }
}
