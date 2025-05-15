// Import database connection and Agent model
import dbConnect from "@/lib/db";
import agentModel from "@/models/Agent";

// Handle GET request to fetch all agents (excluding passwords)
export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Retrieve all agents and exclude the password field
    const agents = await agentModel.find().select("-password");

    // Return the list of agents with a success message
    return Response.json(
      { message: "Agents fetched successfully", agents },
      { status: 200 }
    );
  } catch (error) {
    // Log and return internal server error
    console.error("Error fetching agents:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
