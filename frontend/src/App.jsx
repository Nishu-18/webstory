import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddStory from "./pages/AddStory.jsx";
import EditStory from "./pages/EditStory.jsx";
import Categories from "./pages/Categories.jsx";
import Player from "./pages/Player.jsx";
import Login from "./pages/Login.jsx";
import ChatWidget from "./components/ChatWidget.jsx";

export default function App() {

  function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/story/:id" element={<Player />} />
          <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/add" element={<PrivateRoute><AddStory/></PrivateRoute>}/>
          <Route path="/admin/edit/:id" element={<PrivateRoute><EditStory /></PrivateRoute>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        
        </Routes>
        <ChatWidget/>
      </div>
    </div>
  );
}
