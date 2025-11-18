// src/pages/AddStory.jsx
import { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { createStory } from "../api";
import { useNavigate } from "react-router-dom";

export default function AddStory() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [slides, setSlides] = useState([]);
  const [uploading, setUploading] = useState(false);

  // NEW STATES for AI
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const navigate = useNavigate();

  // ===========================
  // 📌 Upload from PC
  // ===========================
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadedSlides = [];
      for (const file of files) {
        const result = await uploadToCloudinary(file);
        uploadedSlides.push({ ...result, animation: "" });
      }
      setSlides((prev) => [...prev, ...uploadedSlides]);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ===========================
  // 🤖 Generate AI IMAGE
  // ===========================
  const generateAIImage = async () => {
    if (!aiPrompt.trim()) {
      alert("Enter a prompt first.");
      return;
    }

    try {
      setAiLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/image`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: aiPrompt })
        }
      );

      const data = await response.json();
      if (!data.image) {
        alert("Image generation failed");
        return;
      }

      // upload this image_url to cloudinary
      const uploaded = await uploadToCloudinary(data.image, true);

      setSlides((prev) => [...prev, uploaded]);

    } catch (error) {
      alert("AI image generation error");
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  // ===========================
  // 🤖 Generate AI VIDEO
  // ===========================
  const generateAIVideo = async () => {
    if (!aiPrompt.trim()) {
      alert("Enter a prompt first.");
      return;
    }

    try {
      setAiLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/video`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: aiPrompt })
        }
      );

      const data = await response.json();
      if (!data.video) {
        alert("Video generation failed");
        return;
      }

      // Upload video to Cloudinary
      const uploaded = await uploadToCloudinary(data.video, true);

      setSlides((prev) => [...prev, uploaded]);

    } catch (error) {
      alert("AI video generation error");
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  // Remove slide
  const removeSlide = (index) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Story
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || slides.length === 0) {
      alert("Please fill all fields and upload/add at least one slide.");
      return;
    }

    try {
      const newStory = { title, category, slides };

      await createStory(newStory);
      alert("Story added successfully!");
      navigate("/admin");
    } catch (err) {
      alert("Failed to create story");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <h1 className="text-2xl font-semibold mb-6">➕ Add Story</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow p-6 rounded-lg">
        
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter story title"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. Travel, Food, Tech..."
          />
        </div>

        {/* Upload & AI Tools */}
        <div>
          <label className="block font-medium mb-1">Slides</label>

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="w-full border rounded px-3 py-2"
          />

          {uploading && <p className="text-blue-600 mt-2">Uploading...</p>}

          {/* AI Tools */}
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h3 className="font-medium mb-2"> Generate using AI </h3>

            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Enter prompt for AI..."
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={generateAIImage}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                <div className="flex items-center cursor-pointer ">
                  <span>Generate Image</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2">
    <path d="M12 4l1.4 3.4L17 9l-3.6 1.6L12 14l-1.4-3.4L7 9l3.6-1.6L12 4z" />
  </svg>
         
                </div>
                      </button>

              <button
                type="button"
                onClick={generateAIVideo}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
              >
               <div className="flex items-center ">
                 <span>Generate Video</span>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2">
    <path d="M12 4l1.4 3.4L17 9l-3.6 1.6L12 14l-1.4-3.4L7 9l3.6-1.6L12 4z" />
  </svg>
               </div>
              </button>
            </div>

            {aiLoading && <p className="text-purple-600 mt-3">AI is generating...</p>}
          </div>
        </div>

        {/* Slides Preview */}
        {slides.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {slides.map((slide, index) => (
              <div key={index} className="relative border rounded overflow-hidden">
                {slide.type === "video" ? (
                  <video src={slide.url} controls className="w-full h-40 object-cover" />
                ) : (
                  <img src={slide.url} className="w-full h-40 object-cover" />
                )}

                <button
                  type="button"
                  onClick={() => removeSlide(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-1 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading || aiLoading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Save Story
        </button>
      </form>
    </div>
  );
}
