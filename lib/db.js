import mongoose from "mongoose";

const dbConnect = async () => {
  // Reuse existing connection if already connected to avoid multiple connections
  if (mongoose.connections[0].readyState) return;

  try {
    // Connect to MongoDB using environment variable for URI
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    // Log connection errors and rethrow for upstream handling
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default dbConnect;
