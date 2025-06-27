import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mainRoutes from "./routes";
import connectDB from "./config/db";


const app = express();
app.use(express.json());
app.use("/api/v1", mainRoutes);

// Optional: route setup placeholder
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Mentorship Matching API");
});

// Start server only if DB connects
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
