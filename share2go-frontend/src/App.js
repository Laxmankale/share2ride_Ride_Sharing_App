import { useEffect, useState } from "react";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import PostRide from "./pages/PostRide";
import DriverBookings from "./pages/DriverBookings";
import DriverRides from "./pages/DriverRides";

// Get user from localStorage
const storedUser = localStorage.getItem("user");
const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
const loggedInUserId = loggedInUser ? loggedInUser.id : null;
const loggedInRole = loggedInUser ? loggedInUser.role : null;

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* ✅ Common Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking-success" element={<BookingSuccess />} />

        {/* ✅ Routes for Passenger */}
        {loggedInRole === "Passenger" && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/my-bookings"
              element={<MyBookings userId={loggedInUserId} />}
            />
          </>
        )}

        {/* ✅ Routes for Driver */}
        {loggedInRole === "Driver" && (
          <>
            <Route path="/" element={<PostRide />} />
            <Route path="/post-ride" element={<PostRide />} />
            <Route path="/driver-bookings" element={<DriverBookings />} />
            <Route path="/my-posted-rides" element={<DriverRides />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
