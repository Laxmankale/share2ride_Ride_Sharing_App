import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Dashboard({ userName = 'John Doe', userId: propUserId }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? propUserId ?? 1;
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    totalPassengers: 0,
    totalEarnings: 0
  });
  
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const ridesResponse = await axios.get(`http://localhost:8080/api/rides/driver/${userId}`);
      const driverRides = ridesResponse.data;
      
      let totalBookings = 0;
      let totalEarnings = 0;
      const ridesWithBookings = await Promise.all(
        driverRides.map(async (ride) => {
          try {
            const bookingsResponse = await axios.get(`http://localhost:8080/api/bookings/ride/${ride.id}`);
            const bookings = bookingsResponse.data;
            
            totalBookings += bookings.length;
            const rideEarnings = bookings.reduce((sum, b) => sum + (b.numberOfSeats * ride.pricePerSeat), 0);
            totalEarnings += rideEarnings;
            
            const bookingsWithNames = await Promise.all(
              bookings.map(async (booking) => {
                try {
                  const passengerResponse = await axios.get(`http://localhost:8080/api/users/${booking.passengerId}`);
                  return {
                    ...booking,
                    passengerName: passengerResponse.data.name
                  };
                } catch (err) {
                  return {
                    ...booking,
                    passengerName: 'Unknown'
                  };
                }
              })
            );
            
            return {
              ...ride,
              bookings: bookingsWithNames
            };
          } catch (err) {
            return {
              ...ride,
              bookings: []
            };
          }
        })
      );
      
      setStats({
        totalRides: driverRides.length,
        activeRides: driverRides.filter(r => new Date(r.departureTime) > new Date()).length,
        totalPassengers: totalBookings,
        totalEarnings: totalEarnings
      });
      
      setRides(ridesWithBookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        totalRides: 0,
        activeRides: 0,
        totalPassengers: 0,
        totalEarnings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/accept`);
      await fetchDashboardData();
    } catch (e) {
      console.error('Accept failed', e);
      alert(e?.response?.data?.message || 'Failed to accept booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/reject`);
      await fetchDashboardData();
    } catch (e) {
      console.error('Reject failed', e);
      alert(e?.response?.data?.message || 'Failed to reject booking');
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:8080/api/bookings/${bookingId}`);
      await fetchDashboardData();
    } catch (e) {
      console.error('Cancel failed', e);
      alert(e?.response?.data?.message || 'Failed to cancel booking');
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

  const DriverDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-blue-100">Manage your rides and track your passengers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Rides</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalRides}</p>
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
              <p className="text-gray-500 text-sm font-medium">Active Rides</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.activeRides}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Passengers</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalPassengers}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">₹{stats.totalEarnings}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/create-ride')}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold">Post New Ride</span>
          </button>
          
          <button
            onClick={() => fetchDashboardData()}
            className="flex items-center justify-center space-x-3 bg-white border-2 border-blue-600 text-blue-600 p-4 rounded-lg hover:bg-blue-50 transition-all"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-semibold">Refresh</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">My Rides & Passenger Bookings</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 mt-2">No rides posted yet</p>
            <button
              onClick={() => navigate('/create-ride')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create your first ride
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rides.map((ride) => (
              <div key={ride.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {ride.origin} → {ride.destination}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ride.bookings.length > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ride.bookings.length > 0 ? 'Bookings Received' : 'No Bookings Yet'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDateTime(ride.departureTime)}
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {ride.availableSeats} seats available
                      </div>
                      <div className="flex items-center font-semibold text-green-600">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ₹{ride.pricePerSeat}/seat
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                    Edit
                  </button>
                </div>

                {ride.bookings.length > 0 ? (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Passenger Bookings ({ride.bookings.length})
                    </h4>
                    <div className="space-y-2">
                      {ride.bookings.map((booking, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {booking.passengerName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{booking.passengerName}</p>
                              <p className="text-xs text-gray-500">Passenger ID: {booking.passengerId}</p>
                              <p className="text-xs">
                                <span className={`px-2 py-0.5 rounded-full text-white ${booking.status === 'PENDING' ? 'bg-yellow-500' : booking.status === 'CONFIRMED' ? 'bg-green-600' : booking.status === 'REJECTED' ? 'bg-red-600' : booking.status === 'CANCELLED' ? 'bg-gray-500' : 'bg-blue-600'}`}>
                                  {booking.status}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? 's' : ''}</p>
                            <p className="text-sm text-green-600 font-semibold">₹{booking.numberOfSeats * ride.pricePerSeat}</p>
                            <div className="mt-2 flex gap-2 justify-end">
                              {booking.status === 'PENDING' && (
                                <>
                                  <button onClick={() => handleAccept(booking.id)} className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700">Accept</button>
                                  <button onClick={() => handleReject(booking.id)} className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">Reject</button>
                                </>
                              )}
                              {(booking.status === 'CONFIRMED' || booking.status === 'ACCEPTED') && (
                                <button onClick={() => handleCancel(booking.id)} className="px-3 py-1 text-sm rounded bg-gray-600 text-white hover:bg-gray-700">Cancel</button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Total Booked:</span>
                        <span className="font-bold text-gray-800">
                          {ride.bookings.reduce((sum, b) => sum + (b.numberOfSeats || 0), 0)} seats / 
                          ₹{ride.bookings.reduce((sum, b) => sum + ((b.numberOfSeats || 0) * ride.pricePerSeat), 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-yellow-800">
                      No passengers have booked this ride yet
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <DriverDashboard />
      </div>
    </div>
  );
}

export default Dashboard;