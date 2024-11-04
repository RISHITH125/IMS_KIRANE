// src/pages/Dashboard.js
import React, { useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Searchbar from '../components/navbar';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { profile, setProfile } = useUser();

  useEffect(() => {
    // Fetch or update the profile if needed
    // Example: setProfile({ name: 'John Doe', email: 'john.doe@example.com' });
  }, [setProfile]);

  // console.log(profile);

  // Extract the username from the profile, if available
  const username = profile?.name;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 w-screen h-screen bg-gray-100">
        {/* Searchbar */}
        <Searchbar />

        {profile && username ? (
          <div  className='felx-col h-auto w-auto'>
            <h1 className='w-auto text-4xl font-bold pl-10 pt-5 pb-5 text-gray-700 text-center'>Dashboard</h1>
            <hr className='b-2 bg-gray-900 w-full'></hr>
            <div className="flex-1 p-10 bg-gray-100">
            {/* Welcome message */}
            <h1 className="text-4xl font-semibold mb-10 text-black">
              Hello, {username}
            </h1>

            <p className="text-lg text-gray-600">
              Welcome back to your dashboard. Here's what's happening today...
            </p>

            {/* Placeholder for future content */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600">This section can be updated with real-time data, graphs, etc.</p>
            </div>
          </div>
          </div>
          
        ) : (
          <div className="flex flex-col items-center justify-center p-10 h-auto w-full text-center bg-gray-100">
            <h1 className="text-xl font-semibold text-gray-600 mb-4">You have not signed in</h1>
            <Link to="/auth" className="text-blue-500 hover:underline flex items-center">
              <h1 className="text-xl font-semibold mb-10 flex items-center">
                Sign in <ArrowRight className='ml-2'/></h1>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
