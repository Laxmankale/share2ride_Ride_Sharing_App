import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getRidesByDriver,
  deleteRide,
  updateRide,
} from "../api/rides";
import RideForm from "../components/RideForm";
import PassengerIdsModal from "../components/PassengerIdsModal";
import { publishRideApi } from "../api/rides";

export default function DriverDashboard() {
  const { user } = useAuth();
  const driverId = user?.id;

  const [rides, setRides] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const size = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(null); // ride being edited
  const [showCreate, setShowCreate] = useState(false);
  const [showPassengers, setShowPassengers] = useState({ open: false, passengerIds: [] });

  // fetch rides
  const load = async (p = page) => {
    if (!driverId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getRidesByDriver(driverId, p, size);
      // support either Spring Page or raw array
      if (data && data.content) {
        setRides(data.content);
        setTotal(data.totalElements || data.content.length);
      } else if (Array.isArray(data)) {
        setRides(data);
        setTotal(data.length);
      } else {
        // fallback: object with fields
        setRides(Array.isArray(data.rides) ? data.rides : []);
        setTotal(data.totalElements || 0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load rides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(0);
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverId]);

  const handleDelete = async (rideId) => {
    if (!confirm("Delete this ride? This action cannot be undone.")) return;
    try {
      await deleteRide(rideId);
      // reload current page
      load(page);
    } catch (err) {
      console.error(err);
      alert("Failed to delete ride.");
    }
  };

  const handleEditSubmit = async (payload) => {
    if (!editing) return;
    try {
      await updateRide(editing.id, payload);
      setEditing(null);
      load(page);
    } catch (err) {
      console.error(err);
      alert("Failed to update ride.");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    load(0);
    setPage(0);
  };

  const totalPages = Math.max(1, Math.ceil(total / size));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setShowCreate(true)}
          >
            New Ride
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Rides</div>
          <div className="text-xl font-semibold">{total}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Seats Available (page)</div>
          <div className="text-xl font-semibold">
            {rides.reduce((acc, r) => acc + (r.availableSeats ?? 0), 0)}
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Passengers (page)</div>
          <div className="text-xl font-semibold">
            {rides.reduce((acc, r) => acc + (r.passengerIds?.length ?? 0), 0)}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Origin</th>
              <th className="px-4 py-2 text-left">Destination</th>
              <th className="px-4 py-2 text-left">Departure</th>
              <th className="px-4 py-2 text-left">Seats</th>
              <th className="px-4 py-2 text-left">Passengers</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">Loading...</td>
              </tr>
            ) : rides.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">No rides found.</td>
              </tr>
            ) : (
              rides.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">{r.origin}</td>
                  <td className="px-4 py-3">{r.destination}</td>
                  <td className="px-4 py-3">
                    {r.departureTime ? new Date(r.departureTime).toLocaleString() : ""}
                  </td>
                  <td className="px-4 py-3">{r.availableSeats ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{r.passengerIds?.length ?? 0}</span>
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() =>
                          setShowPassengers({ open: true, passengerIds: r.passengerIds ?? [] })
                        }
                      >
                        View IDs
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-1 border rounded text-sm ${
                          r.passengerIds?.length > 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (r.passengerIds?.length > 0) {
                            alert("Cannot edit a ride with booked passengers.");
                            return;
                          }
                          setEditing(r);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {page + 1} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => { const np = Math.max(0, page - 1); setPage(np); load(np); }}
            disabled={page <= 0}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => { const np = Math.min(totalPages - 1, page + 1); setPage(np); load(np); }}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {editing && (
        <RideForm
          initialData={editing}
          onSubmit={handleEditSubmit}
          onClose={() => setEditing(null)}
        />
      )}

     {showCreate && (
  <RideForm
    initialData={null}
    onSubmit={async (payload) => {
      try {
        await publishRideApi(driverId, payload);   // CREATE RIDE
        handleCreateSuccess();                     // Refresh list
      } catch (err) {
        console.error(err);
        alert("Failed to create ride");
      }
    }}
    onClose={() => setShowCreate(false)}
  />
)}


      {showPassengers.open && (
        <PassengerIdsModal
          passengerIds={showPassengers.passengerIds}
          onClose={() => setShowPassengers({ open: false, passengerIds: [] })}
        />
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}
