// backend/routes/storyRoutes.js
import express from "express";
import {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory
} from "../controllers/storyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/",verifyToken, createStory);
router.put("/:id",verifyToken, updateStory);
router.delete("/:id",verifyToken, deleteStory);

export default router;
