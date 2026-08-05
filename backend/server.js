import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start Express server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Study Abroad Platform API running on port ${PORT}`);
  });
}).catch((err) => {
  console.error(`[Server] Connection failed: ${err.message}`);
});