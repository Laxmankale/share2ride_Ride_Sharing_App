import api from "./axios";

export async function createBooking(bookingData) {
  const res = await api.post("/api/bookings", bookingData);
  return res.data;
}

export async function getPassengerBookings(passengerId) {
  const res = await api.get(`/api/bookings/passenger/${passengerId}`);
  return res.data;
}

export async function cancelBooking(bookingId) {
  const res = await api.delete(`/api/bookings/${bookingId}`);
  return res.data;
}

export async function getBookingsForRide(rideId) {
  const res = await api.get(`/api/bookings/ride/${rideId}`);
  return res.data;
}

export async function updateBookingStatus(bookingId, status) {
  if (status === 'CONFIRMED') {
    const res = await api.put(`/api/bookings/${bookingId}/accept`);
    return res.data;
  } else if (status === 'REJECTED') {
    const res = await api.put(`/api/bookings/${bookingId}/reject`);
    return res.data;
  }
}
