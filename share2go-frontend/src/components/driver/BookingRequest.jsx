import React from "react";

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

export default BookingRequest;
