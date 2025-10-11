// Register page import React from 'react';

function Register({ onNavigate }) {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <h3 className="text-xl font-semibold mb-4">Register Page</h3>
      <p className="mb-6">This will be your registration form!</p>
      
      <button 
        onClick={() => onNavigate('home')}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back to Home
      </button>
    </div>
  );
}

export default Register;