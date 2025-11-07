import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PassengerDashboard({ userName = 'Priya Sharma', userId = 2 }) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingRides: 0,
    completedRides: 0,
    totalSpent: 0
  });
  
  const [bookings, setBookings] = useState([]);
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    fetchPassengerData();
    fetchAvailableRides();
  }, [userId]);

  const fetchAvailableRides = async () => {
    setRidesLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/rides');
      const allRides = response.data;
      
      const now = new Date();
      const future = allRides.filter(ride => 
        new Date(ride.departureTime) > now && 
        ride.availableSeats > 0
      );
      
      setAvailableRides(future);
    } catch (error) {
      console.error('Error fetching available rides:', error);
      setAvailableRides([]);
    } finally {
      setRidesLoading(false);
    }
  };

  const fetchPassengerData = async () => {
    setLoading(true);
    try {
      const bookingsResponse = await axios.get(`http://localhost:8080/api/bookings/passenger/${userId}`);
      const passengerBookings = bookingsResponse.data;
      
      const bookingsWithDetails = await Promise.all(
        passengerBookings.map(async (booking) => {
          try {
            const rideResponse = await axios.get(`http://localhost:8080/api/rides/${booking.rideId}`);
            const ride = rideResponse.data;
            
            const driverResponse = await axios.get(`http://localhost:8080/api/users/${ride.driverId}`);
            const driver = driverResponse.data;
            
            return {
              id: booking.id,
              origin: ride.origin,
              destination: ride.destination,
              departureTime: ride.departureTime,
              driverName: driver.name,
              numberOfSeats: booking.numberOfSeats,
              pricePerSeat: ride.pricePerSeat,
              totalAmount: booking.numberOfSeats * ride.pricePerSeat,
              status: booking.status,
              bookingTime: booking.bookingTime
            };
          } catch (err) {
            console.error('Error fetching booking details:', err);
            return null;
          }
        })
      );
      
      const validBookings = bookingsWithDetails.filter(b => b !== null);
      
      const now = new Date();
      const upcomingRides = validBookings.filter(
        b => new Date(b.departureTime) > now && b.status === 'CONFIRMED'
      ).length;
      const completedRides = validBookings.filter(
        b => new Date(b.departureTime) <= now && b.status === 'CONFIRMED'
      ).length;
      const totalSpent = validBookings.filter(b => b.status === 'CONFIRMED')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      
      setStats({
        totalBookings: validBookings.length,
        upcomingRides,
        completedRides,
        totalSpent
      });
      
      setBookings(validBookings);
    } catch (error) {
      console.error('Error fetching passenger data:', error);
      setStats({
        totalBookings: 0,
        upcomingRides: 0,
        completedRides: 0,
        totalSpent: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBookRide = (ride) => {
    setSelectedRide(ride);
    setNumberOfSeats(1);
    setBookingError('');
    setBookingSuccess('');
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (numberOfSeats < 1 || numberOfSeats > selectedRide.availableSeats) {
      setBookingError(`Please select between 1 and ${selectedRide.availableSeats} seats`);
      return;
    }

    try {
      const bookingData = {
        rideId: selectedRide.id,
        passengerId: userId,
        numberOfSeats: numberOfSeats
      };

      await axios.post('http://localhost:8080/api/bookings', bookingData);
      
      setBookingSuccess('Booking confirmed successfully!');
      setTimeout(() => {
        setShowBookingModal(false);
        fetchPassengerData();
        fetchAvailableRides();
        setActiveTab('mybookings');
      }, 1500);
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError(
        error.response?.data?.message || 
        'Failed to book ride. Please try again.'
      );
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://localhost:8080/api/bookings/${bookingId}`);
        alert('Booking cancelled successfully!');
        await fetchPassengerData();
        await fetchAvailableRides();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-green-100">Find and book your next ride</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalBookings}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Upcoming Rides</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.upcomingRides}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed Rides</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.completedRides}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">₹{stats.totalSpent}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'available'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>Available Rides</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('mybookings')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'mybookings'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>My Bookings</span>
              </div>
            </button>
          </nav>
        </div>

        {activeTab === 'available' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Available Rides</h2>
              <button
                onClick={fetchAvailableRides}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-semibold">Refresh</span>
              </button>
            </div>
            
            {ridesLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-600 mt-2">Loading available rides...</p>
              </div>
            ) : availableRides.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 mt-2">No rides available at the moment</p>
                <p className="text-gray-500 text-sm mt-1">Check back later for new rides</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {availableRides.map((ride) => (
                  <div key={ride.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {ride.origin} → {ride.destination}
                          </h3>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Available
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 space-x-4 flex-wrap gap-2">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDateTime(ride.departureTime)}
                          </div>
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Driver: <span className="font-medium ml-1">{ride.driverName}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {ride.availableSeats} seats available
                          </div>
                          <div className="flex items-center font-bold text-green-600">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ₹{ride.pricePerSeat}/seat
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookRide(ride)}
                        className="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all transform hover:scale-105 font-semibold"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mybookings' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">My Bookings</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-600 mt-2">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-600 mt-2">No bookings yet</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="mt-4 text-green-600 hover:text-green-700 font-semibold"
                >
                  Browse available rides
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {booking.origin} → {booking.destination}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'CONFIRMED' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDateTime(booking.departureTime)}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 space-x-4 flex-wrap">
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Driver: <span className="font-medium ml-1">{booking.driverName}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center font-semibold text-green-600">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              ₹{booking.totalAmount}
                            </div>
                          </div>

                          <div className="flex items-center text-xs text-gray-500">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Booked on: {formatDateTime(booking.bookingTime)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {booking.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showBookingModal && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Book Ride</h3>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {selectedRide.origin} → {selectedRide.destination}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Driver: {selectedRide.driverName}</p>
                  <p>Departure: {formatDateTime(selectedRide.departureTime)}</p>
                  <p>Available Seats: {selectedRide.availableSeats}</p>
                  <p className="font-semibold text-green-600">Price: ₹{selectedRide.pricePerSeat}/seat</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedRide.availableSeats}
                  value={numberOfSeats}
                  onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{numberOfSeats * selectedRide.pricePerSeat}
                  </span>
                </div>
              </div>

              {bookingError && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {bookingError}
                </div>
              )}

              {bookingSuccess && (
                <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {bookingSuccess}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={bookingSuccess}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PassengerDashboard;