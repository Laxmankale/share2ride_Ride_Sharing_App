import React from "react";
import BookingRequest from "./BookingRequest";

const BookingsModal = ({ ride, bookings, onClose, onAction }) => {
    if (!ride) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        Bookings for {ride.origin} → {ride.destination}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {bookings.length === 0 ? (
                        <p className="text-center text-gray-500">No booking requests yet.</p>
                    ) : (
                        bookings.map(booking => (
                            <BookingRequest
                                key={booking.id}
                                booking={booking}
                                onAccept={(id) => onAction(id, 'CONFIRMED')}
                                onReject={(id) => onAction(id, 'REJECTED')}
                            />
                        ))
                    )}
                </div>
                <div className="bg-gray-50 px-6 py-3 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingsModal;
