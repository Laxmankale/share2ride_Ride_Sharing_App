import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.jpeg'; 

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
           <img 
             src={logo} 
             alt="Share2Go Logo" 
             className="h-16 w-16 object-contain"
           />
            <h1 className="text-2xl font-bold text-blue-600">
              Share2Go
            </h1>
          </div>

          <nav className="space-x-4">
            {isAuthenticated() && user ? (
              <>
                <span className="px-4 py-2 text-gray-700">
                  Welcome, {user.name}!
                </span>
                {user.role === 'Driver' && location.pathname !== '/driver-dashboard' && (
                  <button 
                    onClick={() => navigate('/driver-dashboard')}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </button>
                )}
                {user.role === 'Passenger' && location.pathname !== '/passenger-dashboard' && (
                  <button 
                    onClick={() => navigate('/passenger-dashboard')}
                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                  >
                    Dashboard
                  </button>
                )}
                {user.role === 'Driver' && location.pathname !== '/create-ride' && (
                  <button 
                    onClick={() => navigate('/create-ride')}
                    className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
                  >
                    Create Ride
                  </button>
                )}
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </button>
                )}
                {location.pathname !== '/register' && (
                  <button 
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Register
                  </button>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;