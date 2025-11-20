import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notifications";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const count = await getUnreadCount(user.id);
      setUnreadCount(count);
      const list = await getUserNotifications(user.id);
      // Ensure list is an array
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // Auto-refresh every 15s
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readFlag: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
      // Revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readFlag: false } : n))
      );
      setUnreadCount((prev) => prev + 1);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, readFlag: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="w-full bg-white shadow-md px-8 py-4 flex justify-between items-center z-50 relative">
      <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
        Share2Go
      </Link>

      <div className="flex items-center gap-6">

        {(user?.role === "Driver" || user?.role === "DRIVER") && (
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

        {(user?.role === "Passenger" || user?.role === "PASSENGER") && (
          <Link
            to="/passenger/dashboard"
            className="text-blue-600 font-medium hover:text-blue-800 transition"
          >
            Dashboard
          </Link>
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
            
            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition"
              >
                {/* Bell Icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                
                {/* Unread Badge */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => !notif.readFlag && handleMarkRead(notif.id)}
                          className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition ${
                            !notif.readFlag ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            {!notif.readFlag && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full mt-1 flex-shrink-0"></span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                             {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-gray-700 text-sm font-semibold hidden md:inline-block">
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
