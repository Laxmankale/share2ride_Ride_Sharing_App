import React from 'react';

const PassengerStats = ({ stats }) => {
    return (
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
                <div className="text-xl font-bold">₹{stats.totalSpent.toFixed(2)}</div>
            </div>
        </div>
    );
};

export default PassengerStats;
