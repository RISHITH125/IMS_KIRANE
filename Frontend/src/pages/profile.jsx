import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Assuming you have this context
import "../App.css";

const ProfilePage = () => {
  const { profile, setProfile } = useUser(); // Using UserContext
  const navigate = useNavigate();

  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (!profile && userProfile) {
      setProfile(JSON.parse(userProfile)); // Sync context with localStorage if refreshed
    }
  }, [profile, setProfile]);

  const handleLogout = () => {
    localStorage.removeItem('userProfile'); // Clear from localStorage
    setProfile(null); // Clear context state
    navigate('/auth'); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">User Profile</h2>

        {profile ? (
          <div className="space-y-4">
            {/* User Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-800">Full Name:</h3>
              <p className="text-gray-600">{profile.fullName || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Username:</h3>
              <p className="text-gray-600">{profile.username || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Email:</h3>
              <p className="text-gray-600">{profile.email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Store Name:</h3>
              <p className="text-gray-600">{profile.storename || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Phone Number:</h3>
              <p className="text-gray-600">{profile.phoneNumber || 'N/A'}</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            >
              Log Out
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600">No user information available.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
