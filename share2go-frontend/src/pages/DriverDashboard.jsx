import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getRidesByDriver,
  deleteRide,
  updateRide,
  publishRideApi,
} from "../api/rides";
import { getBookingsForRide, updateBookingStatus, cancelBooking } from "../api/bookings";
import RideForm from "../components/RideForm";
import PassengerIdsModal from "../components/PassengerIdsModal";

// --- Components ---

const StatisticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-white rounded-lg shadow border-l-4 border-blue-500">
        <div className="text-sm text-gray-500 font-medium">Total Rides</div>
        <div className="text-2xl font-bold text-gray-800">{stats.totalRides}</div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow border-l-4 border-green-500">
        <div className="text-sm text-gray-500 font-medium">Active Rides</div>
        <div className="text-2xl font-bold text-gray-800">{stats.activeRides}</div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow border-l-4 border-purple-500">
        <div className="text-sm text-gray-500 font-medium">Total Passengers</div>
        <div className="text-2xl font-bold text-gray-800">{stats.totalPassengers}</div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow border-l-4 border-yellow-500">
        <div className="text-sm text-gray-500 font-medium">Total Earnings</div>
        <div className="text-2xl font-bold text-gray-800">${stats.totalEarnings.toFixed(2)}</div>
      </div>
    </div>
  );
};

const QuickActions = ({ onPostRide, onRefresh }) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={onPostRide}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
      >
        <span className="mr-2">+</span> Post New Ride
      </button>
      <button
        onClick={onRefresh}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition border border-gray-300"
      >
        <span className="mr-2">↻</span> Refresh
      </button>
    </div>
  );
};

const BookingRequest = ({ booking, onAccept, onReject }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2 border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
          {booking.passengerName ? booking.passengerName.charAt(0).toUpperCase() : "P"}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-800">
            {booking.passengerName || "Passenger"}
          </div>
          <div className="text-xs text-gray-500">
            Seats: {booking.seatsBooked || booking.numberOfSeats} • Status: {booking.status}
          </div>
        </div>
      </div>
      {booking.status === "PENDING" && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(booking.id)}
            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(booking.id)}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
      {booking.status === "CONFIRMED" && (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Confirmed</span>
      )}
      {booking.status === "REJECTED" && (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Rejected</span>
      )}
      {booking.status === "CANCELLED" && (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Cancelled</span>
      )}
    </div>
  );
};

const RideCard = ({ ride, onDelete, onEdit, onViewBookings, pendingCount }) => {
  const earnings = (ride.pricePerSeat || 0) * (ride.bookedSeats || 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition relative">
      {pendingCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">
          {pendingCount} Request{pendingCount > 1 ? 's' : ''}
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <span>{ride.origin}</span>
            <span className="text-gray-400">→</span>
            <span>{ride.destination}</span>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(ride.departureTime).toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">${ride.pricePerSeat}</div>
          <div className="text-xs text-gray-500">per seat</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500">Seats</span>
          <span className="font-medium">
            {ride.availableSeats} / {ride.totalSeats || (ride.availableSeats + (ride.passengerIds?.length || 0))}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Earnings</span>
          <span className="font-medium text-green-600">${earnings.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${ride.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
            }`}>
            {ride.status || 'ACTIVE'}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewBookings(ride)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${pendingCount > 0
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
              : "text-blue-600 hover:bg-blue-50"
              }`}
          >
            Bookings {pendingCount > 0 && `(${pendingCount} New)`}
          </button>
          <button
            onClick={() => onEdit(ride)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium"
            disabled={ride.passengerIds?.length > 0}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(ride.id)}
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

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
  const [rideBookings, setRideBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

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
    // Bookings are already in bookingsMap, but we can refresh them if needed
    // For now, just use the map
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
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
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
                  bookings={bookingsMap[ride.id] || []}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">
                  Bookings for {selectedRideForBookings.origin} → {selectedRideForBookings.destination}
                </h3>
                <button
                  onClick={() => setSelectedRideForBookings(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Use bookings from map */}
                {(bookingsMap[selectedRideForBookings.id] || []).length === 0 ? (
                  <p className="text-center text-gray-500">No booking requests yet.</p>
                ) : (
                  (bookingsMap[selectedRideForBookings.id] || []).map(booking => (
                    <BookingRequest
                      key={booking.id}
                      booking={booking}
                      onAccept={(id) => handleBookingAction(id, 'CONFIRMED')}
                      onReject={(id) => handleBookingAction(id, 'REJECTED')}
                    />
                  ))
                )}
              </div>
              <div className="bg-gray-50 px-6 py-3 text-right">
                <button
                  onClick={() => setSelectedRideForBookings(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
