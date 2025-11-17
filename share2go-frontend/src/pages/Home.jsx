import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <p className="text-lg text-gray-700">
          Welcome, <b>{user.email}</b>! You are logged in as <b>{user.role}</b>.
        </p>
      )}
    </div>
  );
}
