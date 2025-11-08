import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          WebStories
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-600">User</Link>
          <Link to="/admin" className="hover:text-blue-600">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
