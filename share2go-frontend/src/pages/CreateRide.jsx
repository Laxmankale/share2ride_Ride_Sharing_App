import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function CreateRide() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departureTime: "",
    availableSeats: "",
    pricePerSeat: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.origin.trim()) errs.origin = "Origin is required";
    if (!form.destination.trim()) errs.destination = "Destination is required";
    if (!form.departureTime) errs.departureTime = "Departure date/time required";
    if (!form.availableSeats || isNaN(form.availableSeats) || form.availableSeats < 1)
      errs.availableSeats = "Seats must be a positive number";
    if (!form.pricePerSeat || isNaN(form.pricePerSeat) || form.pricePerSeat < 1)
      errs.pricePerSeat = "Price must be a positive number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccessMsg("");
    try {
      const rideData = {
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        departureTime: form.departureTime,
        availableSeats: parseInt(form.availableSeats),
        pricePerSeat: parseFloat(form.pricePerSeat)
      };

      await axios.post(
        `http://localhost:8080/api/rides/driver/${user.id}`,
        rideData
      );

      setSuccessMsg("Ride created! Redirecting to dashboard...");
      setForm({
        origin: "",
        destination: "",
        departureTime: "",
        availableSeats: "",
        pricePerSeat: ""
      });
      setTimeout(() => navigate("/driver-dashboard"), 1800);
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message ||
          "Failed to create ride. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Create a New Ride
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Fill in the details below to post your ride.
        </p>
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMsg}
          </div>
        )}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Origin *</label>
            <input
              name="origin"
              type="text"
              value={form.origin}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.origin ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter start location"
            />
            {errors.origin && <p className="text-red-500 text-sm mt-1">{errors.origin}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Destination *</label>
            <input
              name="destination"
              type="text"
              value={form.destination}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.destination ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter destination"
            />
            {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Departure Date & Time *</label>
            <input
              name="departureTime"
              type="datetime-local"
              value={form.departureTime}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.departureTime ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.departureTime && <p className="text-red-500 text-sm mt-1">{errors.departureTime}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Available Seats *</label>
            <input
              name="availableSeats"
              type="number"
              min="1"
              value={form.availableSeats}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.availableSeats ? "border-red-500" : "border-gray-300"}`}
              placeholder="Number of seats"
            />
            {errors.availableSeats && <p className="text-red-500 text-sm mt-1">{errors.availableSeats}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Price Per Seat (₹) *</label>
            <input
              name="pricePerSeat"
              type="number"
              min="1"
              value={form.pricePerSeat}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pricePerSeat ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g. 150"
            />
            {errors.pricePerSeat && <p className="text-red-500 text-sm mt-1">{errors.pricePerSeat}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors mt-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            }`}
          >
            {loading ? "Posting Ride..." : "Post Ride"}
          </button>
        </form>
        <button
          onClick={() => navigate("/driver-dashboard")}
          className="w-full text-center mt-6 text-sm text-blue-600 hover:text-blue-800 font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CreateRide;