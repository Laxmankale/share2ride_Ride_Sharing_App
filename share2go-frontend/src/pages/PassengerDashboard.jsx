import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllRides, searchRides } from "../api/rides";
import { createBooking, getPassengerBookings, cancelBooking } from "../api/bookings";
import PassengerStats from "../components/passenger/PassengerStats";
import SearchRides from "../components/passenger/SearchRides";
import AvailableRidesList from "../components/passenger/AvailableRidesList";
import MyBookingsList from "../components/passenger/MyBookingsList";
import BookingModal from "../components/passenger/BookingModal";

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
      // Create a clean params object with only non-empty values
      const params = {};
      if (searchParams.origin) params.origin = searchParams.origin;
      if (searchParams.destination) params.destination = searchParams.destination;
      if (searchParams.departureTime) params.departureTime = searchParams.departureTime;

      // Always use searchRides to benefit from backend date filtering (future rides only)
      // If params is empty, it returns all future rides
      const data = await searchRides(params);

      const rides = Array.isArray(data) ? data : (data.content || []);
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
      <PassengerStats stats={stats} />

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
          <SearchRides
            searchParams={searchParams}
            handleSearchChange={handleSearchChange}
            handleSearchSubmit={handleSearchSubmit}
            clearFilters={clearFilters}
          />

          {/* Rides List */}
          <AvailableRidesList
            rides={availableRides}
            loading={loadingRides}
            openBookingModal={openBookingModal}
          />
        </div>
      )}

      {activeTab === "bookings" && (
        <div>
          <MyBookingsList
            bookings={myBookings}
            loading={loadingBookings}
            handleCancelBooking={handleCancelBooking}
          />
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        bookingModal={bookingModal}
        setBookingModal={setBookingModal}
        handleBookRide={handleBookRide}
      />
    </div>
  );
}
