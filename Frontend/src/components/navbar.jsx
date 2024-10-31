import { Search, Bell, User } from 'lucide-react'; // Using User icon as placeholder
import { Link } from 'react-router-dom';

const Searchbar = () => {
    return (
        <div className="flex h-14 bg-slate-50 items-center px-4 shadow-md border-b-2">
            
            {/* Search Bar */}
            <div className="relative w-full max-w-xs">
                <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Type here"
                    className="input w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring focus:ring-gray-100 bg-slate-50"
                />
            </div>
            
            <div className="flex items-center ml-auto space-x-4">
                {/* Alerts Link */}
                <Link to="/alerts" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-200 hover:scale-105 transition-transform duration-300">
                    <Bell className="text-gray-500" />
                </Link>
                
                {/* Profile Icon */}
                <Link to="/profile" className="flex items-center">
                    <div className="w-10 h-10 rounded-full border-gray-500 border-2 bg-white flex items-center justify-center overflow-hidden">
                        <User className="text-gray-500 w-6 h-6" />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Searchbar;
