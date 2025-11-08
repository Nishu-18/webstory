import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddStory from "./pages/AddStory.jsx";
import EditStory from "./pages/EditStory.jsx";
import Categories from "./pages/Categories.jsx";
import Player from "./pages/Player.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/story/:id" element={<Player />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/add" element={<AddStory />} />
          <Route path="/admin/edit/:id" element={<EditStory />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
