import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getRidesByDriver,
  deleteRide,
  updateRide,
  publishRideApi,
} from "../api/rides";
import { getBookingsForRide, updateBookingStatus } from "../api/bookings";
import RideForm from "../components/RideForm";
import StatisticsCards from "../components/driver/StatisticsCards";
import QuickActions from "../components/driver/QuickActions";
import RideCard from "../components/driver/RideCard";
import BookingsModal from "../components/driver/BookingsModal";

export default function DriverDashboard() {
  const { user } = useAuth();
  const driverId = user?.id;

  const [rides, setRides] = useState([]);
  const [bookingsMap, setBookingsMap] = useState({}); // rideId -> bookings[]
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    totalPassengers: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [selectedRideForBookings, setSelectedRideForBookings] = useState(null);

  const fetchRides = async () => {
    if (!driverId) return;
    setLoading(true);
    try {
      // Fetching all rides (large size) to calculate stats on frontend
      // In a real app, we should have a dedicated stats endpoint
      const data = await getRidesByDriver(driverId, 0, 100);
      const ridesList = data.content || (Array.isArray(data) ? data : []) || [];

      setRides(ridesList);

      // Fetch bookings for all rides to calculate stats correctly
      const newBookingsMap = {};
      await Promise.all(ridesList.map(async (ride) => {
        try {
          const bookings = await getBookingsForRide(ride.id);
          newBookingsMap[ride.id] = bookings || [];
        } catch (e) {
          console.warn(`Failed to fetch bookings for ride ${ride.id}`, e);
          newBookingsMap[ride.id] = [];
        }
      }));
      setBookingsMap(newBookingsMap);

      calculateStats(ridesList, newBookingsMap);
    } catch (err) {
      console.error("Error fetching rides:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ridesData, bookingsData) => {
    const totalRides = ridesData.length;
    const activeRides = ridesData.filter(r => new Date(r.departureTime) > new Date()).length;

    let totalPassengers = 0;
    let totalEarnings = 0;

    ridesData.forEach(r => {
      const bookings = bookingsData[r.id] || [];
      const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'ACCEPTED');

      totalPassengers += confirmedBookings.length;

      const bookedSeats = confirmedBookings.reduce((acc, b) => acc + b.numberOfSeats, 0);
      // Update ride object with calculated booked seats for display
      r.bookedSeats = bookedSeats;

      totalEarnings += (r.pricePerSeat || 0) * bookedSeats;
    });

    setStats({
      totalRides,
      activeRides,
      totalPassengers,
      totalEarnings
    });
  };

  useEffect(() => {
    fetchRides();
  }, [driverId]);

  const handlePostRide = async (rideData) => {
    try {
      await publishRideApi(driverId, rideData);
      setShowCreate(false);
      fetchRides();
    } catch (err) {
      console.error(err);
      alert("Failed to post ride");
    }
  };

  const handleEditRide = async (rideData) => {
    if (!editingRide) return;
    try {
      await updateRide(editingRide.id, rideData);
      setEditingRide(null);
      fetchRides();
    } catch (err) {
      console.error(err);
      alert("Failed to update ride");
    }
  };

  const handleDeleteRide = async (rideId) => {
    if (!confirm("Are you sure you want to cancel this ride? This will notify all passengers.")) return;
    try {
      await deleteRide(rideId);
      fetchRides();
    } catch (err) {
      console.error(err);
      alert("Failed to delete ride");
    }
  };

  const handleViewBookings = async (ride) => {
    setSelectedRideForBookings(ride);
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      await updateBookingStatus(bookingId, action); // 'CONFIRMED' or 'REJECTED'
      // Refresh all data to update stats and UI
      fetchRides();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action.toLowerCase()} booking.`);
    }
  };

  const getPendingCount = (rideId) => {
    const bookings = bookingsMap[rideId] || [];
    return bookings.filter(b => b.status === 'PENDING').length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Driver'}!</h1>
          <p className="text-gray-600">Manage your rides and track your earnings</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <StatisticsCards stats={stats} />

        <QuickActions
          onPostRide={() => setShowCreate(true)}
          onRefresh={fetchRides}
        />

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Rides</h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading your rides...</p>
            </div>
          ) : rides.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-10 text-center">
              <p className="text-gray-500 text-lg mb-4">You haven't posted any rides yet.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post Your First Ride
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rides.map(ride => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  onDelete={handleDeleteRide}
                  onEdit={(r) => setEditingRide(r)}
                  onViewBookings={handleViewBookings}
                  pendingCount={getPendingCount(ride.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Create/Edit Modal */}
        {(showCreate || editingRide) && (
          <RideForm
            initialData={editingRide}
            onSubmit={editingRide ? handleEditRide : handlePostRide}
            onClose={() => {
              setShowCreate(false);
              setEditingRide(null);
            }}
          />
        )}

        {/* Bookings Modal */}
        {selectedRideForBookings && (
          <BookingsModal
            ride={selectedRideForBookings}
            bookings={bookingsMap[selectedRideForBookings.id] || []}
            onClose={() => setSelectedRideForBookings(null)}
            onAction={handleBookingAction}
          />
        )}

      </div>
    </div>
  );
}
