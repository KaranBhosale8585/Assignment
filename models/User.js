import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // User's full name (mandatory)
  email: { type: String, required: true, unique: true }, // Unique user email for login
  password: { type: String, required: true }, // Hashed password for authentication
});

// Use existing model if compiled, else create new to avoid overwrite errors
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
