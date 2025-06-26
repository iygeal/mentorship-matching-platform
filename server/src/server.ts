import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db";


const app = express();
app.use(express.json());

// Optional: route setup placeholder
app.get("/", (_req, res) => res.send("Mentorship Matching API"));

// Start server only if DB connects
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
