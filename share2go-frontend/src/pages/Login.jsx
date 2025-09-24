import React, { useState } from "react";

export default function WelcomePage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Passenger");

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ email: email, role: role });
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setRole("Passenger");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-semibold mb-4">Login to Share2Go</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              >
                <option value="Passenger">Passenger</option>
                <option value="Driver">Driver</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {user.email}</h2>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md bg-red-50 text-red-600"
          >
            Logout
          </button>
        </header>

        {user.role === "Passenger" && (
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-lg font-medium mb-2">Passenger Placeholder</h3>
            <p className="text-gray-600">Here you will see available rides once backend is connected.</p>
          </div>
        )}

        {user.role === "Driver" && (
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-lg font-medium mb-2">Driver Placeholder</h3>
            <p className="text-gray-600">Here you will see your posted rides and bookings once backend is connected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
