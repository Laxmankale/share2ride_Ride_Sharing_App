import React, { useEffect, useState } from "react";

export default function RideForm({ initialData = null, onSubmit, onClose }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [pricePerSeat, setPricePerSeat] = useState("");

  useEffect(() => {
    if (initialData) {
      setOrigin(initialData.origin || "");
      setDestination(initialData.destination || "");
      setDepartureTime(
        initialData.departureTime ? initialData.departureTime.replace("Z", "") : ""
      );
      setAvailableSeats(initialData.availableSeats ?? "");
      setPricePerSeat(initialData.pricePerSeat ?? "");
    }
  }, [initialData]);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      origin,
      destination,
      departureTime,
      availableSeats: Number(availableSeats),
      pricePerSeat: pricePerSeat ? Number(pricePerSeat) : 0,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Ride" : "Create Ride"}
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Origin</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Destination</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Departure Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Available Seats</label>
            <input
              type="number"
              min="1"
              className="w-full border rounded px-3 py-2"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price Per Seat (optional)</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              value={pricePerSeat}
              onChange={(e) => setPricePerSeat(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
              {initialData ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
