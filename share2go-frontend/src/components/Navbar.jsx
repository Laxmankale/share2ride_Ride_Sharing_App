import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.jpeg'; 
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let timer;
    const fetchUnread = async () => {
      try {
        if (user?.id) {
          const res = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}/unread-count`);
          setUnread(res.data);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchUnread();
    if (user?.id) {
      timer = setInterval(fetchUnread, 15000);
    }
    return () => timer && clearInterval(timer);
  }, [user?.id]);

  const openDropdown = async () => {
    if (!open) {
      try {
        if (user?.id) {
          const res = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}`);
          setItems(res.data);
        }
      } catch (e) {
        // ignore
      }
    }
    setOpen(!open);
  };

  const markAllRead = async () => {
    try {
      if (user?.id) {
        await axios.put(`http://localhost:8080/api/notifications/user/${user.id}/read-all`);
        setUnread(0);
        setItems(prev => prev.map(i => ({ ...i, readFlag: true })));
      }
    } catch (e) {
      // ignore
    }
  };

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

          <nav className="space-x-4 flex items-center">
            {isAuthenticated() && user ? (
              <>
                <span className="px-4 py-2 text-gray-700">
                  Welcome, {user.name}!
                </span>
                <div className="relative">
                  <button onClick={openDropdown} className="relative px-3 py-2 rounded hover:bg-gray-100">
                    <span className="sr-only">Notifications</span>
                    <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                        {unread}
                      </span>
                    )}
                  </button>
                  {open && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded border border-gray-200 z-50">
                      <div className="flex items-center justify-between px-3 py-2 border-b">
                        <span className="font-semibold text-gray-700">Notifications</span>
                        <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-auto">
                        {items.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">No notifications</div>
                        ) : (
                          items.map(n => (
                            <div key={n.id} className={`px-4 py-3 text-sm border-b ${n.readFlag ? 'bg-white' : 'bg-blue-50'}`}>
                              <div className="text-gray-800">{n.message}</div>
                              <div className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
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