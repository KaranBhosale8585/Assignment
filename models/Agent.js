import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"], // Validation with custom error message
      trim: true, // Removes whitespace from start/end to keep data clean
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Email must be provided
      unique: true, // Ensures no duplicate emails in DB
      lowercase: true, // Store email in lowercase for consistency
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"], // Phone must be provided
      unique: true, // Phone number must be unique
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Password is mandatory
      // Store hashed passwords only (hash before save)
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Avoid model overwrite issue by checking existing models
export default mongoose.models.Agent || mongoose.model("Agent", AgentSchema);
