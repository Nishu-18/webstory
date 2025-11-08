// backend/models/Story.js
import mongoose from "mongoose";
import SlideSchema from "./Slide.js";

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, index: true },
  slides: { type: [SlideSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Story = mongoose.models.Story || mongoose.model("Story", StorySchema);
export default Story;
