import { Link } from 'react-router-dom';
import "../App.css";
import { FiHome, FiBox, FiShoppingCart, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-white w-64 p-5 space-y-6">
      <h1 className="text-2xl font-bold text-center">AngdiPro</h1>
      <nav className="mt-10 flex-1">
        <Link to="/dashboard" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <FiHome className="mr-3" /> {/* Icon for Dashboard */}
          Dashboard
        </Link>
        <Link to="/products" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <FiBox className="mr-3" /> {/* Icon for Products */}
          Products
        </Link>
        <Link to="/orders" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          <FiShoppingCart className="mr-3" /> {/* Icon for Orders */}
          Sales
        </Link>
        <Link to="/settings" className=" flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 mt-auto">
          <FiSettings className="mr-3" /> {/* Icon for Settings */}
          Settings
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;