// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchStories } from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await fetchStories();
      setStories(data);
    } catch (err) {
      setError("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stories/${id}`, {
        method: "DELETE",
      });
      setStories((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete story");
    }
  };

  if (loading) return <p className="text-gray-600">Loading stories...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-15">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">📋 CMS Dashboard</h1>
        <Link
          to="/admin/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <p className="text-gray-600">No stories found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3">Title</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Created</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
           <tbody>
  {stories.map((story) => (
    <tr
      key={story._id}
      className="border-t hover:bg-gray-50 transition-colors"
    >
      <td className="py-3 px-3 font-medium text-gray-800">{story.title}</td>
      <td className="py-3 px-3 text-gray-600">{story.category}</td>
      <td className="py-3 px-3 text-gray-500 text-sm">
        {new Date(story.createdAt).toLocaleDateString()}
      </td>
      <td className="py-3 px-3 text-center space-x-2 flex flex-wrap justify-center md:table-cell">
        <Link
          to={`/admin/edit/${story._id}`}
          className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={() => handleDelete(story._id)}
          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          🗑️ Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
