// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "User", path: "/" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-5 py-3">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          <BookOpen size={26} />
          WebStories
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 transition-colors
                after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:bottom-[-4px] after:left-0 after:transition-all hover:after:w-full
                ${isActive ? "text-blue-600 after:w-full" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-5 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 transition ${
                  isActive ? "text-blue-600 bg-blue-50 dark:bg-gray-800" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
