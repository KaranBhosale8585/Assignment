import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    firstName: String, // Lead's first name
    phone: String, // Contact phone number for the lead
    notes: String, // Additional notes about the lead
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent", // Reference to the Agent assigned to this lead
    },
  },
  { timestamps: true } // Auto-manages createdAt and updatedAt timestamps
);

// Prevent model recompilation errors in dev/hot-reload
export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
