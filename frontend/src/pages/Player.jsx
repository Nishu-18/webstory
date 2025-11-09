// src/pages/Player.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStoryById } from "../api";

import { motion, AnimatePresence } from "framer-motion";

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  // Fetch story data
  useEffect(() => {
    async function loadStory() {
      const data = await fetchStoryById(id);
      console.log(data);
      
      setStory(data);
      setCurrentIndex(0);
    }
    loadStory();
  }, [id]);

  // Auto-advance slides with progress bar
  useEffect(() => {
    if (!story || !story.slides?.length) return;

    const slide = story.slides[currentIndex];
    const duration = slide.type === "video" ? 8000 : 4000; // in ms
    let start = Date.now();

    // clear previous timers
    clearInterval(progressRef.current);
    clearTimeout(timerRef.current);
    setProgress(0);

    // progress bar animation
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / duration) * 100, 100));
    }, 100);

    // auto move to next
    timerRef.current = setTimeout(() => {
      nextSlide();
    }, duration);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [currentIndex, story]);

  const nextSlide = () => {
    
    
    
    if (!story) return;
    if (currentIndex < story.slides.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsPlaying(false); // stop at end
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsPlaying(true);
    }
  };

  const replay = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  if (!story) return <p className="text-center text-gray-300">Loading story...</p>;
  const slide = story.slides[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute font-bold-sm top-12 left-3 bg-white text-black px-3 py-1 rounded text-sm cursor-pointer"
      >
        Back
      </button>

      {/* Main slide */}
      <div className="max-w-md w-full relative">
        <AnimatePresence mode="wait">
            <motion.div 
                key={slide.url} // key change triggers animation
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            >
                 {slide.type === "video" ? (
          <video
            key={slide.url}
            src={slide.url}
            className="w-full h-[70vh] object-cover rounded-lg"
            autoPlay
            muted
            onEnded={nextSlide}
          />
        ) : (
          <img
            key={slide.url}
            src={slide.url}
            alt={`slide-${currentIndex}`}
            className="w-full h-[70vh] object-cover rounded-lg transition-opacity duration-500"
          />
        )}



            </motion.div>
        </AnimatePresence>
       

        {/* Click zones for next/prev */}
        <div
          className="absolute inset-0 flex cursor-pointer"
          onClick={(e) => {
            const clickX = e.nativeEvent.offsetX;
            const width = e.currentTarget.offsetWidth;
            if (clickX < width / 2) prevSlide();
            else nextSlide();
          }}
        >
          <div className="flex-1" />
        </div>
      </div>

      {/* Progress bar indicators */}
      <div className="flex gap-1 mt-4 w-full max-w-md px-2">
        {story.slides.map((_, idx) => (
          <div
            key={idx}
            className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden"
          >
            <div
              className={`h-full bg-white transition-all duration-100 linear ${
                idx === currentIndex ? "" : idx < currentIndex ? "w-full" : "w-0"
              }`}
              style={idx === currentIndex ? { width: `${progress}%` } : {}}
            ></div>
          </div>
        ))}
      </div>

      {/* Replay button at end */}
      {!isPlaying && (
        <button
          onClick={replay}
          className="mt-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          🔁 Replay Story
        </button>
      )}
    </div>
  );
}