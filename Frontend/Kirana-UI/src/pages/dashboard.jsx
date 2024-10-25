// src/pages/Dashboard.js
import React, { useState } from 'react';
import Sidebar from '../components/sidebar';

const Dashboard = () => {
  // State to store the username
  const [username, setUsername] = useState('Rishi'); // This will be fetched dynamically later
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-10 bg-gray-100">
        {/* No need to escape single quotes */}
        <h1 className="text-4xl font-semibold mb-10">
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
  );
};

export default Dashboard;
