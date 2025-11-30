import React from 'react';

const MyBookingsList = ({ bookings, loading, handleCancelBooking }) => {
    return (
        <div className="grid gap-4">
            {loading ? (
                <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                bookings.map(booking => (
                    <div key={booking.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                        <div>
                            <div className="font-bold text-lg">
                                {booking.ride?.origin} ➝ {booking.ride?.destination}
                            </div>
                            <div className="text-sm text-gray-600">
                                {new Date(booking.ride?.departureTime).toLocaleString()}
                            </div>
                            <div className="mt-1">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div>{booking.numberOfSeats} seats</div>
                            <div className="font-bold">₹{((booking.ride?.pricePerSeat || 0) * booking.numberOfSeats).toFixed(2)}</div>
                            {booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
                                <button
                                    className="mt-2 text-red-600 hover:underline text-sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyBookingsList;
