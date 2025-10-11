import React from 'react';

function Home({ onNavigate }) {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Welcome to Share2Go!</h2>
      <p className="text-gray-600 mb-6">Your ride-sharing app</p>

      {/* Navigation Buttons */}
      <div className="space-x-4">
        <button 
          onClick={() => onNavigate('login')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button 
          onClick={() => onNavigate('register')}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </div>

      <div className="mt-8">
        <p className="text-lg">Choose an option above to get started!</p>
      </div>
    </div>
  );
}

export default Home;