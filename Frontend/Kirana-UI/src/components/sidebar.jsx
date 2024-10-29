import { Link } from 'react-router-dom';
import "../App.css";
import { FiHome, FiBox, FiShoppingCart, FiSettings, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useState } from 'react';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex flex-col min-h-screen ${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-800 text-white transition-all duration-300`}>
      
      {/* Sidebar Toggle Button - Now Inside Sidebar */}
      <button 
        onClick={toggleSidebar} 
        className={`flex items-center justify-center h-10 w-10 mt-4 ml-auto mr-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-all duration-300 ${sidebarOpen ? 'self-end' : 'self-center'}`}
      >
        {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      </button>
      
      {/* Sidebar Header */}
      {sidebarOpen && <h1 className="text-2xl font-bold text-center mt-4">AngdiPro</h1>}
      
      {/* Navigation Links */}
      <nav className={`mt-10 ${sidebarOpen ? '' : 'flex flex-col items-center'}`}>
        <Link to="/dashboard" className={`flex items-center ${sidebarOpen ? 'py-2.5 px-4' : 'justify-center p-2'} rounded hover:bg-gray-700 hover:scale-105 transition-transform duration-300`}>
          <FiHome className={sidebarOpen ? "mr-3" : ""} />
          {sidebarOpen && "Dashboard"}
        </Link>
        <Link to="/products" className={`flex items-center ${sidebarOpen ? 'py-2.5 px-4' : 'justify-center p-2'} rounded hover:bg-gray-700 hover:scale-105 transition-transform duration-300`}>
          <FiBox className={sidebarOpen ? "mr-3" : ""} />
          {sidebarOpen && "Products"}
        </Link>
        <Link to="/orders" className={`flex items-center ${sidebarOpen ? 'py-2.5 px-4' : 'justify-center p-2'} rounded hover:bg-gray-700 hover:scale-105 transition-transform duration-300`}>
          <FiShoppingCart className={sidebarOpen ? "mr-3" : ""} />
          {sidebarOpen && "Orders"}
        </Link>
        <Link to="/settings" className={`flex items-center ${sidebarOpen ? 'py-2.5 px-4' : 'justify-center p-2 mt-auto'} rounded hover:bg-gray-700 hover:scale-105 transition-transform duration-300`}>
          <FiSettings className={sidebarOpen ? "mr-3" : ""} />
          {sidebarOpen && "Settings"}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
