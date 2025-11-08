// backend/models/Slide.js
import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  animation: {
    type: String,
    default: null
  }
}, { _id: false }); // slides will be embedded and don't need their own _id

export default SlideSchema;
