import React from 'react';

function Navbar({ onNavigate, currentPage }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700"
          >
            Share2Go
          </h1>

          {/* Navigation Links */}
          <nav className="space-x-4">
            <button 
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded ${
                currentPage === 'home' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className={`px-3 py-2 rounded ${
                currentPage === 'login' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className={`px-3 py-2 rounded ${
                currentPage === 'register' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Register
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;