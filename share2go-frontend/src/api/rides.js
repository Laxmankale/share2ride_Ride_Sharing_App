import api from "./axios";

export async function publishRideApi(driverId, rideData) {
  const res = await api.post(`/api/rides/driver/${driverId}`, rideData);
  return res.data;
}

export async function getRidesByDriver(driverId, page = 0, size = 10) {
  const res = await api.get(
    `/api/rides/driver/${driverId}?page=${page}&size=${size}`
  );
  return res.data;
}

export async function deleteRide(id) {
  const res = await api.delete(`/api/rides/${id}`);
  return res.data;
}

export async function updateRide(id, rideData) {
  const res = await api.put(`/api/rides/${id}`, rideData);
  return res.data;
}

export async function searchRides(params) {
  const res = await api.get("/api/rides/search", { params });
  return res.data;
}

export async function getAllRides(page = 0, size = 10) {
  const res = await api.get(`/api/rides?page=${page}&size=${size}`);
  return res.data;
}