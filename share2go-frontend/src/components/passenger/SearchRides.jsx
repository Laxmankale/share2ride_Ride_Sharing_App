import React from 'react';

const SearchRides = ({ searchParams, handleSearchChange, handleSearchSubmit, clearFilters }) => {
    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end flex-wrap">
                <div>
                    <label className="block text-sm font-medium">Origin</label>
                    <input
                        name="origin"
                        value={searchParams.origin}
                        onChange={handleSearchChange}
                        className="border rounded px-3 py-2"
                        placeholder="From..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Destination</label>
                    <input
                        name="destination"
                        value={searchParams.destination}
                        onChange={handleSearchChange}
                        className="border rounded px-3 py-2"
                        placeholder="To..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input
                        type="date"
                        name="departureTime"
                        value={searchParams.departureTime}
                        onChange={handleSearchChange}
                        className="border rounded px-3 py-2"
                    />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Search
                    </button>
                    <button type="button" onClick={clearFilters} className="bg-gray-300 text-black px-4 py-2 rounded">
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchRides;
