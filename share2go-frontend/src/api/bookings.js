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
