import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>

      {!user && (
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </Link>
      )}

      {user && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome back, {user.name || user.email}!</h2>
          <p className="text-lg text-gray-700 mb-6">
            You are logged in as a <b>{user.role}</b>.
          </p>

          {user.role === "PASSENGER" && (
            <Link
              to="/passenger/dashboard"
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200"
            >
              Go to Passenger Dashboard
            </Link>
          )}
          {user.role === "DRIVER" && (
            <div className="flex flex-col gap-4">
              <p className="text-gray-600">Ready to hit the road?</p>
              <Link
                to="/driver/dashboard"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
              >
                Go to Driver Dashboard
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
