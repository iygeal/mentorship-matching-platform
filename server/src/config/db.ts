import mongoose from "mongoose";

const connectDB = async (): Promise<typeof mongoose | void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected to the Mentorship Matching APP Database");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Stop app if DB connection fails
  }
};

export default connectDB;
