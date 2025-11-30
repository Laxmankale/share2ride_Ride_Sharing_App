import React from 'react';

const AvailableRidesList = ({ rides, loading, openBookingModal }) => {
    return (
        <div className="grid gap-4">
            {loading ? (
                <p>Loading rides...</p>
            ) : rides.length === 0 ? (
                <p>No rides available.</p>
            ) : (
                rides.map(ride => (
                    <div key={ride.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                        <div>
                            <div className="font-bold text-lg">{ride.origin} ➝ {ride.destination}</div>
                            <div className="text-sm text-gray-600">
                                {new Date(ride.departureTime).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                                Driver: {ride.driverName || "Unknown"}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-green-600">₹{ride.pricePerSeat}</div>
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
    );
};

export default AvailableRidesList;
