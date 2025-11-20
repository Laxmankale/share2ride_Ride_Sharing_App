import React from "react";

export default function PassengerIdsModal({ passengerIds = [], onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Passengers (IDs)</h3>
        {passengerIds && passengerIds.length ? (
          <ul className="list-disc pl-5 max-h-60 overflow-auto">
            {passengerIds.map((id) => (
              <li key={id} className="py-1">
                {id}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No passengers yet.</p>
        )}
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-2 rounded bg-gray-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
