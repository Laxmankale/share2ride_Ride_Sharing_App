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
    <nav className="w-full bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
        Share2Go
      </Link>

      <div className="flex items-center gap-6">

        {user?.role === "Driver" && (
          <>
            <Link
              to="/publish-ride"
              className="text-blue-600 font-medium hover:text-blue-800 transition"
            >
              Publish Ride
            </Link>

            <Link
              to="/driver/dashboard"
              className="text-blue-600 font-medium hover:text-blue-800 transition"
            >
              Dashboard
            </Link>
          </>
        )}

        {!user && (
          <Link
            to="/login"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}

        {user && (
          <div className="flex items-center gap-4">

            <span className="text-gray-700 text-sm font-semibold">
              {user.name} {" "}
              <span className="text-gray-500 font-normal">({user.role})</span>
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
