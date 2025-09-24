import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUser(storedUser);

      // Fetch bookings if user is a passenger
      if (storedUser.role === "Passenger") {
        axios
          .get(`http://localhost:8080/api/bookings/user/${storedUser.id}`)
          .then((res) => setBookings(res.data))
          .catch((err) => console.error("Error fetching bookings", err));
      }
    }

    // Fetch available rides
    axios
      .get("http://localhost:8080/api/rides")
      .then((res) => setRides(res.data))
      .catch((err) => console.error("Error fetching rides", err));
  }, []);

  const handleBook = async (rideId) => {
    if (!user || !user.id) {
      alert("Please log in first.");
      return;
    }

    const seats = 1; // Booking 1 seat for now

    try {
      const response = await axios.post(
        `http://localhost:8080/api/bookings?userId=${user.id}&rideId=${rideId}&seats=${seats}`
      );
      console.log("Booking successful", response.data);
      alert("✅ Ride booked successfully!");

      // Optionally refresh bookings
      if (user.role === "Passenger") {
        const res = await axios.get(`http://localhost:8080/api/bookings/user/${user.id}`);
        setBookings(res.data);
      }

    } catch (error) {
      console.error("❌ Booking failed", error);
      alert("❌ Booking failed. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Share2Go</h1>

      {user?.role === "Passenger" && (
        <div className="mb-4">
          {bookings.length > 0 ? (
            <p className="text-green-700">
              ✅ You have booked <strong>{bookings.length}</strong> ride{bookings.length > 1 ? "s" : ""}.
            </p>
          ) : (
            <p className="text-red-600">❌ You haven't booked any rides yet.</p>
          )}
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Available Rides</h2>
      <ul className="space-y-4">
        {rides.map((ride) => (
          <li key={ride.id} className="border p-4 rounded shadow-sm">
            <p><strong>From:</strong> {ride.origin}</p>
            <p><strong>To:</strong> {ride.destination}</p>
            <p><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
            <p><strong>Seats Available:</strong> {ride.availableSeats}</p>
            <p><strong>Price:</strong> ₹{ride.pricePerSeat}</p>

            {user?.role === "Passenger" && (
              <button
                onClick={() => handleBook(ride.id)}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Book Ride
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
