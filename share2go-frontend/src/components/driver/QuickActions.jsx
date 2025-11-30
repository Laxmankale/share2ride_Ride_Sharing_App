import React from "react";

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

export default QuickActions;
