import api from "./axios";

export async function publishRideApi(driverId, rideData) {
  const res = await api.post(`/api/rides/driver/${driverId}`, rideData);
  return res.data;
}
