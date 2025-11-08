// src/pages/EditStory.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStoryById } from "../api";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export default function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const token=localStorage.getItem("token");

  // ✅ Fetch existing story
  useEffect(() => {
    const loadStory = async () => {
      try {
        const data = await fetchStoryById(id);
        setTitle(data.title || "");
        setCategory(data.category || "");
        setSlides(data.slides || []);
      } catch (err) {
        alert("Failed to fetch story details");
      } finally {
        setLoading(false);
      }
    };
    loadStory();
  }, [id]);

  // ✅ Upload new slides
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const newSlides = [];
      for (const file of files) {
        const result = await uploadToCloudinary(file);
        newSlides.push({ ...result, animation: "" });
      }
      setSlides((prev) => [...prev, ...newSlides]);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Remove slide
  const removeSlide = (index) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Update story
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title || !category || slides.length === 0) {
      alert("Please fill all fields and have at least one slide.");
      return;
    }

    try {
      const updatedStory = { title, category, slides };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/stories/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(updatedStory),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      alert("Story updated successfully!");
      navigate("/admin");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-gray-600">Loading story...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-15">
      <h1 className="text-2xl font-semibold mb-6">✏️ Edit Story</h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-6 bg-white shadow p-6 rounded-lg"
      >
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Add Slides</label>
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
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Update Story"}
        </button>
      </form>
    </div>
  );
}
