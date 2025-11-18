// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import storyRoutes from "./routes/storyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());

app.use(express.json({ limit: "10mb" })); // allow JSON bodies
app.use("/api/chat",chatRoutes);
app.use("/api/ai",aiRoutes)

app.get("/", (req, res) => res.send("WebStories API is running"));

app.use("/api/stories", storyRoutes);


app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
