import React from "react";

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
                <div className="text-2xl font-bold text-gray-800">₹{stats.totalEarnings.toFixed(2)}</div>
            </div>
        </div>
    );
};

export default StatisticsCards;
