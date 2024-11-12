import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext'; // Assuming you have a User context
import { MoveRightIcon } from 'lucide-react';
import "../App.css";
// import { isFormElement } from 'react-router-dom/dist/dom';
const Authentication = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useUser();
  const [isform, setIsFormElement] = useState(false);
  // State variables
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', // For signup only
  });

  const [newDetailm, setNewDetail] = useState({
    username: '',
    email: '',
    password: '',
    storename: '',
    fullName: '',
    phoneNumber: '',
  });


  const [error, setError] = useState(''); // For displaying errors

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isform) {
      if (isSignup) {
        // Validate passwords
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords don't match!");
          return;
        }

        // Create signup data object
        const signupData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

        try {
          const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData),
          });
          const data = await response.json();
          if (data.message === 'User_reg_success') {
            setIsSignup(false); // Switch back to login
            setIsFormElement(true)
          } else {
            setError(data.message || 'Something went wrong. Please try again.');
          }
        } catch (error) {
          console.error('Signup error:', error);
          setError('Failed to create account. Please try again later.');
        }
      } else {
        // Login logic
        const loginData = {
          email: formData.email,
          password: formData.password,
        };

        try {
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
          });
          const data = await response.json();
          if (data.message === true) {
            setProfile(data.data); // Assuming the backend sends user profile data
            localStorage.setItem('userProfile', JSON.stringify(data.data));
            navigate('/dashboard');
          } else {
            setError('Invalid credentials, please try again.');
          }
        } catch (error) {
          console.error('Login error:', error);
          setError('Login failed. Please try again later.');
        }
      }
    } else {
      const newDetail = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        storename: formData.storename,
      };
      try {
        const response = await fetch('http://localhost:3000/addStore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDetail),
        });
        const data = await response.json();
        if (data.message === 'User_details_saved') {
          setProfile(data.data); // Assuming the backend sends user profile data
          localStorage.setItem('userProfile', JSON.stringify(data.data));
          navigate('/dashboard');
        } else {
          setError('Invalid credentials, please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Login failed. Please try again later.');
      }
    };
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
    console.log('Google Login Success:', credentialResponseDecoded);

    // Send token to the backend for verification
    try {
      const response = await fetch('http://localhost:3000/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await response.json();
      console.log('Google Auth Response:', data);

      if (data.message === 'Account_exists') {
        // User exists, proceed to the dashboard
        setProfile(credentialResponseDecoded);
        localStorage.setItem('userProfile', JSON.stringify(credentialResponseDecoded));
        navigate('/dashboard');
      }
      else if (data.message === 'New_User_Created') {
        // New user created, navigate to user form to accept details
        setProfile(credentialResponseDecoded);
        setIsFormElement(true);
        localStorage.setItem('userProfile', JSON.stringify(credentialResponseDecoded)); // Navigate to the userForm page for new user details
      }
      else {
        // Handle any unexpected responses or errors
        setError('Google login failed.');
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      setError('Google authentication failed. Please try again later.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Login Failure:', error);
    setError('Google login failed. Please try again.');
  };

  const logOut = () => {
    googleLogout();
    setProfile(null);
    localStorage.removeItem('userProfile'); // Clear local storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      {!isform ?
        <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-md">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
            {isSignup ? 'Create an Account' : 'Welcome'}
          </h2>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 hover:bg-gray-100 transition"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {isSignup ? 'Create Password' : 'Password'}
              </label>
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

            {isSignup && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 hover:bg-gray-100 transition"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              {isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {/* Toggle Signup/Login */}
          <div className="w-auto flex flex-row justify-center m-4">
            <span className="mr-2 text-center">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            </span>
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="h-auto flex flex-col align-middle text-blue-600 underline"
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </button>
          </div>

          {/* Divider */}
          {!isSignup && (
            <div className="flex items-center mt-6">
              <div className="flex-grow h-0.5 bg-gray-300"></div>
              <span className="mx-2 text-gray-400">or</span>
              <div className="flex-grow h-0.5 bg-gray-300"></div>
            </div>
          )}

          {/* Google Login */}
          {!isSignup && (
            <GoogleLogin
              className="google-login-button" // Add the className prop
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          )}
          {/* Logout Button */}

        </div>
        :
        <div className='bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-md'>
          <h2 className='text-3xl font-bold mb-6 text-center text-indigo-700'>User Details</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <label className="block mb-2">
              Full Name:
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 hover:bg-gray-100 transition"
                required
              />
            </label>

            <label className="block mb-2">
              Phone Number:
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 hover:bg-gray-100 transition"
                required
              />
            </label>

            <label className="block mb-2">
              Store Name:
              <input
                type="tel"
                name="phoneNumber"
                value={formData.storename}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 hover:bg-gray-100 transition"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>

          </form>
        </div>}
    </div >
  );
};

export default Authentication;
