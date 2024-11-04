import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useUser } from '../context/UserContext';
// import Cookies from 'js-cookie';

const Authentication = () => {
  const navigate = useNavigate();

  const { profile, setProfile } = useUser();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
    console.log('Google Login Success:', credentialResponseDecoded);
    setProfile(credentialResponseDecoded);
    localStorage.setItem('userProfile', JSON.stringify(credentialResponseDecoded));
    
    navigate('/dashboard');
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Login Failure:', error);
  };

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 hover:bg-gray-100 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 hover:bg-gray-100 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center mt-6">
          <div className="flex-grow h-0.5 bg-gray-300"></div>
          <p className="px-4 text-sm text-gray-500">Or</p>
          <div className="flex-grow h-0.5 bg-gray-300"></div>
        </div>

        <div className="mt-6 w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                Sign Up with Google
              </button>
            )}
          />
        </div>

        {profile && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold">Welcome, {profile.name}</h3>
            <p className="text-sm">{profile.email}</p>
            <img src={profile.picture} alt="Profile" className="w-16 h-16 rounded-full mx-auto mt-2" />
            <button
              onClick={logOut}
              className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authentication;
