import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb+srv://shubhmaa2016_db_user:mdqSN6R2da3BUUsX@cluster0.u4hxwup.mongodb.net/studey-abroad-plateform"
    );
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Error: ${error.message}`);
    // If not in test environment, exit on failure
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

export default connectDB;
