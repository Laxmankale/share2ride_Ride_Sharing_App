import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Share2Go
      </Link>

      <div className="flex items-center gap-4">

        {user?.role === "Driver" && (
          <Link
            to="/publish-ride"
            className="text-blue-600 font-semibold hover:underline"
          >
            Publish Ride
          </Link>
        )}

        {!user && (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
``
        {user && (
          <>
            <span className="text-gray-600 text-sm">
              {user.email} ({user.role})
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

