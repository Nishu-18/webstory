// src/pages/Categories.jsx
import { useEffect, useState } from "react";
import { fetchStories } from "../api";
import { Link } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";

export default function Categories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStories();
        setStories(data);
      } catch (err) {
        console.error("Failed to load stories", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading stories...
      </div>
    );

  if (stories.length === 0)
    return (
      <p className="text-center text-gray-500 mt-12">
        No stories found. Check back later!
      </p>
    );

  // Group stories by category
  const categories = {};
  stories.forEach((story) => {
    if (!categories[story.category]) categories[story.category] = [];
    categories[story.category].push(story);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="text-blue-600" size={28} />
        <h1 className="text-3xl font-semibold text-gray-800">
          Explore Web Story Categories
        </h1>
      </div>

      {/* Category Sections */}
      {Object.keys(categories).map((cat) => (
        <div key={cat} className="mb-12">
          {/* Category Title */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-blue-700 flex items-center gap-2">
              🏷️ {cat}
            </h2>
            <span className="text-sm text-gray-500">
              {categories[cat].length} {categories[cat].length === 1 ? "story" : "stories"}
            </span>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories[cat].map((story) => (
              <Link
                to={`/story/${story._id}`}
                key={story._id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition border border-gray-100"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-44 overflow-hidden">
                  {story.slides[0] && story.slides[0].type === "image" ? (
                    <img
                      src={story.slides[0].url}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : story.slides[0] ? (
                    <video
                      src={story.slides[0].url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      muted
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                </div>

                {/* Story Info */}
                <div className="absolute bottom-0 left-0 p-3 w-full">
                  <p className="font-medium text-white text-sm truncate">
                    {story.title}
                  </p>
                  <p className="text-xs text-gray-200">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    View Story ▶
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
