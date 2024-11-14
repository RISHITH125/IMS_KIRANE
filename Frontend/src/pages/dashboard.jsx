import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import Searchbar from '../components/navbar';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AddSalesForm from '../components/addSalesform';  // Import AddSalesForm
import SalesRecord from '../components/salesRecord';  // Import SalesRecord

const Dashboard = () => {
  const { profile, setProfile } = useUser();
  const [showAddSalesForm, setShowAddSalesForm] = useState(false);  // State to toggle AddSalesForm

  useEffect(() => {
    // Fetch or update the profile if needed
    // Example: setProfile({ name: 'John Doe', email: 'john.doe@example.com' });
  }, [setProfile]);

  const username = profile?.name || profile?.username;

  const handleToggleAddSalesForm = () => {
    setShowAddSalesForm(!showAddSalesForm);  // Toggle the visibility of the AddSalesForm
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 w-screen h-screen bg-gray-100">
        {/* Searchbar */}
        <Searchbar />

        {profile && username ? (
          <div className='flex-col h-auto w-auto'>
            <h1 className='w-auto text-4xl font-bold pl-10 pt-5 pb-5 text-gray-700 text-center'>Dashboard</h1>
            <hr className='border-2 bg-gray-900 w-full'></hr>
            <div className="flex-1 p-10 bg-gray-100">
              {/* Welcome message */}
              <h1 className="text-4xl font-semibold mb-10 text-black">
                Hello, {username}
              </h1>

              <p className="text-lg text-gray-600">
                Welcome back to your dashboard. Here's what's happening today...
              </p>

              {/* Add Sales Button */}
              <button
                onClick={handleToggleAddSalesForm}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600"
              >
                {showAddSalesForm ? "Close Add Sales Form" : "Add Sales Record"}
              </button>

              {/* Add Sales Form */}
              {showAddSalesForm && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                  <AddSalesForm />
                </div>
              )}

              {/* Sales Record Section */}
              <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                <SalesRecord />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 h-auto w-full text-center bg-gray-100">
            <h1 className="text-xl font-semibold text-gray-600 mb-4">You have not signed in</h1>
            <Link to="/auth" className="text-blue-500 hover:underline flex items-center">
              <h1 className="text-xl font-semibold mb-10 flex items-center">
                Sign in <ArrowRight className='ml-2' />
              </h1>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
