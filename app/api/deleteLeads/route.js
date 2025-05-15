// Import database connection and Lead model
import dbConnect from "@/lib/db";
import leadModel from "@/models/Lead";

// Handle DELETE request to remove multiple leads by their IDs
export async function DELETE(req) {
  try {
    // Parse JSON body to extract lead IDs
    const { leadIds } = await req.json();

    // Validate that leadIds is a non-empty array
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return Response.json(
        { message: "leadIds must be a non-empty array" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Delete leads whose IDs match the given array
    const result = await leadModel.deleteMany({ _id: { $in: leadIds } });

    // Respond with success message and number of deleted documents
    return Response.json(
      {
        message: "Leads deleted successfully",
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle and log server error
    console.error("Error deleting leads:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
