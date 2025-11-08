// backend/routes/storyRoutes.js
import express from "express";
import {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/", createStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);

export default router;
