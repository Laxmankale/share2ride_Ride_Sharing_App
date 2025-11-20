import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllRides, searchRides } from "../api/rides";
import { createBooking, getPassengerBookings, cancelBooking } from "../api/bookings";

export default function PassengerDashboard() {
  const { user } = useAuth();
  const passengerId = user?.id;

  const [activeTab, setActiveTab] = useState("available"); // 'available' or 'bookings'

  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingRides: 0,
    completedRides: 0,
    totalSpent: 0,
  });

  // Available Rides State
  const [availableRides, setAvailableRides] = useState([]);
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureTime: "",
  });
  const [loadingRides, setLoadingRides] = useState(false);
  const [bookingModal, setBookingModal] = useState({ open: false, ride: null, seats: 1 });

  // My Bookings State
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Helper to fetch available rides
  const loadRides = async () => {
    setLoadingRides(true);
    try {
      // If search params exist, use search, else get all
      const hasSearch = searchParams.origin || searchParams.destination || searchParams.departureTime;
      let data;
      if (hasSearch) {
        data = await searchRides(searchParams);
      } else {
        // Default load all (paginated usually, but here simplistic)
        const response = await getAllRides(0, 20);
        data = response.content || response;
      }
      
      // Filter for future rides and available seats if getting all (API might not filter)
      const now = new Date();
      const rides = Array.isArray(data) ? data : (data.content || []);
      
      // Simple client side filtering for available seats if API returns all
      // Ideally API does this.
      setAvailableRides(rides);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRides(false);
    }
  };

  // Helper to fetch bookings
  const loadBookings = async () => {
    if (!passengerId) return;
    setLoadingBookings(true);
    try {
      const data = await getPassengerBookings(passengerId);
      setMyBookings(Array.isArray(data) ? data : []);
      calculateStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const calculateStats = (bookings) => {
    const totalBookings = bookings.length;
    const now = new Date();
    let upcoming = 0;
    let completed = 0;
    let spent = 0;

    bookings.forEach(b => {
      const rideDate = new Date(b.ride?.departureTime);
      if (b.status === 'CONFIRMED') {
        spent += (b.ride?.pricePerSeat || 0) * b.numberOfSeats;
      }
      if (rideDate > now && b.status !== 'CANCELLED' && b.status !== 'REJECTED') {
        upcoming++;
      } else if (rideDate <= now && b.status === 'CONFIRMED') {
        completed++;
      }
    });

    setStats({ totalBookings, upcomingRides: upcoming, completedRides: completed, totalSpent: spent });
  };

  useEffect(() => {
    if (activeTab === "available") {
      loadRides();
    } else {
      loadBookings();
    }
  }, [activeTab, passengerId]);

  // Search handlers
  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadRides();
  };

  const clearFilters = () => {
    setSearchParams({ origin: "", destination: "", departureTime: "" });
    // Trigger loadRides after state update (using effect or direct call with empty)
    // Direct call is safer for immediate reaction
    searchRides({}).then(data => {
        setAvailableRides(Array.isArray(data) ? data : (data.content || []));
    }).catch(console.error);
  };

  // Booking handlers
  const openBookingModal = (ride) => {
    setBookingModal({ open: true, ride, seats: 1 });
  };

  const handleBookRide = async () => {
    try {
      const payload = {
        passengerId,
        rideId: bookingModal.ride.id,
        numberOfSeats: parseInt(bookingModal.seats),
      };
      await createBooking(payload);
      alert("Booking request sent!");
      setBookingModal({ open: false, ride: null, seats: 1 });
      loadRides(); // Refresh availability
    } catch (err) {
      console.error(err);
      alert("Failed to book ride.");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Passenger Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Bookings</div>
          <div className="text-xl font-bold">{stats.totalBookings}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Upcoming Rides</div>
          <div className="text-xl font-bold">{stats.upcomingRides}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Completed Rides</div>
          <div className="text-xl font-bold">{stats.completedRides}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Spent</div>
          <div className="text-xl font-bold">${stats.totalSpent.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b">
        <button
          className={`px-4 py-2 ${activeTab === "available" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("available")}
        >
          Available Rides
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "bookings" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          My Bookings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "available" && (
        <div>
          {/* Search Filter */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end flex-wrap">
              <div>
                <label className="block text-sm font-medium">Origin</label>
                <input
                  name="origin"
                  value={searchParams.origin}
                  onChange={handleSearchChange}
                  className="border rounded px-3 py-2"
                  placeholder="From..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Destination</label>
                <input
                  name="destination"
                  value={searchParams.destination}
                  onChange={handleSearchChange}
                  className="border rounded px-3 py-2"
                  placeholder="To..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="date"
                  name="departureTime"
                  value={searchParams.departureTime}
                  onChange={handleSearchChange}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Search
                </button>
                <button type="button" onClick={clearFilters} className="bg-gray-300 text-black px-4 py-2 rounded">
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Rides List */}
          <div className="grid gap-4">
            {loadingRides ? (
              <p>Loading rides...</p>
            ) : availableRides.length === 0 ? (
              <p>No rides available.</p>
            ) : (
              availableRides.map(ride => (
                <div key={ride.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{ride.origin} ➝ {ride.destination}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(ride.departureTime).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Driver: {ride.driver?.name || "Unknown"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">${ride.pricePerSeat}</div>
                    <div className="text-sm text-gray-500">{ride.availableSeats} seats left</div>
                    <button
                      className="mt-2 bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
                      disabled={ride.availableSeats <= 0}
                      onClick={() => openBookingModal(ride)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div>
          <div className="grid gap-4">
            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : myBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              myBookings.map(booking => (
                <div key={booking.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">
                      {booking.ride?.origin} ➝ {booking.ride?.destination}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(booking.ride?.departureTime).toLocaleString()}
                    </div>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{booking.numberOfSeats} seats</div>
                    <div className="font-bold">${((booking.ride?.pricePerSeat || 0) * booking.numberOfSeats).toFixed(2)}</div>
                    {booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
                      <button
                        className="mt-2 text-red-600 hover:underline text-sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Book Ride</h2>
            <div className="mb-4">
              <p><b>Route:</b> {bookingModal.ride.origin} ➝ {bookingModal.ride.destination}</p>
              <p><b>Price per seat:</b> ${bookingModal.ride.pricePerSeat}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Number of Seats</label>
              <input
                type="number"
                min="1"
                max={bookingModal.ride.availableSeats}
                value={bookingModal.seats}
                onChange={(e) => setBookingModal({ ...bookingModal, seats: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="text-right font-bold mb-4">
              Total: ${(bookingModal.seats * bookingModal.ride.pricePerSeat).toFixed(2)}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setBookingModal({ open: false, ride: null, seats: 1 })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleBookRide}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
