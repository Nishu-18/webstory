// backend/controllers/storyController.js
import Story from "../models/Story.js";
import mongoose from "mongoose";

export const getStories = async (req, res, next) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    next(err);
  }
};

export const getStoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (err) {
    next(err);
  }
};

export const createStory = async (req, res, next) => {
  try {
    const { title, category, slides } = req.body;
    if (!title || !category) return res.status(400).json({ message: "title and category are required" });

    const story = new Story({ title, category, slides: slides || [] });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    next(err);
  }
};

export const updateStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const updated = await Story.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Story not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const removed = await Story.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Story not found" });
    res.json({ message: "Story deleted", id });
  } catch (err) {
    next(err);
  }
};
