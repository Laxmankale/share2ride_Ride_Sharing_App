import React from 'react';

const BookingModal = ({ bookingModal, setBookingModal, handleBookRide }) => {
    if (!bookingModal.open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Book Ride</h2>
                <div className="mb-4">
                    <p><b>Route:</b> {bookingModal.ride.origin} ➝ {bookingModal.ride.destination}</p>
                    <p><b>Price per seat:</b> ₹{bookingModal.ride.pricePerSeat}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Number of Seats</label>
                    <input
                        type="number"
                        min="1"
                        max={bookingModal.ride.availableSeats}
                        value={bookingModal.seats}
                        onChange={(e) => setBookingModal({ ...bookingModal, seats: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div className="text-right font-bold mb-4">
                    Total: ₹{(bookingModal.seats * bookingModal.ride.pricePerSeat).toFixed(2)}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 border rounded"
                        onClick={() => setBookingModal({ open: false, ride: null, seats: 1 })}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={handleBookRide}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
