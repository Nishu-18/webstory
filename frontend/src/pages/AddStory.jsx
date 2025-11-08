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
  const navigate = useNavigate();

  // ✅ handle file upload
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

  // ✅ remove slide
  const removeSlide = (index) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || slides.length === 0) {
      alert("Please fill all fields and upload at least one slide.");
      return;
    }

    try {
      const newStory = {
        title,
        category,
        slides,
      };

      await createStory(newStory);
      alert("Story added successfully!");
      navigate("/admin");
    } catch (err) {
      alert("Failed to create story");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">➕ Add Story</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow p-6 rounded-lg"
      >
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
        </div>

        {slides.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="relative border rounded overflow-hidden"
              >
                {slide.type === "video" ? (
                  <video
                    src={slide.url}
                    controls
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <img
                    src={slide.url}
                    alt={`slide-${index}`}
                    className="w-full h-40 object-cover"
                  />
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

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Save Story"}
        </button>
      </form>
    </div>
  );
}
