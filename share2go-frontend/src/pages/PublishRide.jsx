import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { publishRideApi } from "../api/rides";

export default function PublishRide() {
  const { user } = useAuth();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [pricePerSeat, setPricePerSeat] = useState("");  // optional

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!origin || !destination || !departureTime || !availableSeats) {
      setError("All fields are required.");
      return;
    }

    if (!user?.id) {
      setError("User ID missing. Please re-login.");
      console.error("User object:", user);
      return;
    }

    const rideData = {
      origin,
      destination,
      departureTime,
      availableSeats: Number(availableSeats),  // FIXED NAME
      pricePerSeat: pricePerSeat ? Number(pricePerSeat) : 0
    };

    try {
      const response = await publishRideApi(user.id, rideData);
      console.log("Ride created:", response);
      alert("Ride published successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to publish ride. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Publish a Ride
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Origin</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter starting location"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Destination</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Departure Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Available Seats</label>
            <input
              type="number"
              min="1"
              className="w-full border rounded px-3 py-2"
              placeholder="Available seats"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Price Per Seat (Optional)</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              placeholder="Price per seat"
              value={pricePerSeat}
              onChange={(e) => setPricePerSeat(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Publish Ride
          </button>
        </form>
      </div>
    </div>
  );
}
