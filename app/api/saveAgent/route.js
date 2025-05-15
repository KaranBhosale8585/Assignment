// Import necessary modules and database/model dependencies
import dbConnect from "@/lib/db";
import agentModel from "@/models/Agent";
import bcrypt from "bcryptjs";

// Handle POST request to register a new agent
export async function POST(req) {
  try {
    // Parse the request body
    const { fullName, email, phone, password } = await req.json();

    // Parse the request body
    if (!fullName || !email || !phone || !password) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Check if agent with given email already exists
    const existingAgent = await agentModel.findOne({ email });
    if (existingAgent) {
      return Response.json(
        { message: "Agent with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new agent record
    const newAgent = await agentModel.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    // Respond with success and agent details (excluding password)
    return Response.json(
      {
        message: "Agent created successfully",
        agent: {
          id: newAgent._id,
          fullName: newAgent.fullName,
          email: newAgent.email,
          phone: newAgent.phone,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error creating agent:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
