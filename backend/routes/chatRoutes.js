// backend/routes/chatRoutes.js
import { ragChat } from "../rag/ragChat.js";
import express from "express";
const router = express.Router();

// Simple test endpoint to check chat route
router.get("/health", async (req, res) => {
  res.json({ ok: true, message: "Chat route healthy" });
});

// placeholder: ask endpoint will be added later
router.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  const answer = await ragChat(question);
  res.json({ answer });
});


export default router;
