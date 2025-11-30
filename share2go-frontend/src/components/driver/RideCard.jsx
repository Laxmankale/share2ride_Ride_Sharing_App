import React from "react";

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
                    <div className="text-lg font-bold text-green-600">₹{ride.pricePerSeat}</div>
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
                    <span className="font-medium text-green-600">₹{earnings.toFixed(2)}</span>
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

export default RideCard;
