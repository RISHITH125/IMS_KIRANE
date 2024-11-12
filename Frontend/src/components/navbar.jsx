import { useState } from 'react';
import { Search, Bell, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
const Searchbar = ({ data, onFilter }) => {
    const {profile , setProfile} = useUser();

    const [searchQuery, setSearchQuery] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() !== '') {
            const filteredData = data.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(query.toLowerCase())
                )
            );
            onFilter(filteredData);
            setIsFiltered(true);
        } else {
            onFilter(data); // Reset to original data
            setIsFiltered(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        onFilter(data); // Reset to original data
        setIsFiltered(false);
    };

    return (
        <div className="flex h-14 bg-slate-50 items-center px-4 shadow-md border-b-2">
            {/* Search Bar */}
            <div className="flex items-center w-full max-w-xs bg-white rounded-xl border border-transparent px-3 py-2 focus-within:border-gray-300 transition-colors">
                <Search className="text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search here"
                    className="w-full bg-transparent outline-none"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                {isFiltered && (
                    <X
                        className="text-gray-500 cursor-pointer ml-2"
                        onClick={clearSearch}
                    />
                )}
            </div>
            <div className="flex items-center ml-auto space-x-4">
                {/* Alerts Link */}
                <Link
                    to="/alerts"
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-200 hover:scale-105 transition-transform duration-300"
                >
                    <Bell className="text-gray-500" />
                </Link>

                {/* Profile Icon */}
                <Link to={`/${profile?.storename || 'default'}/profile`} className="flex items-center">
                    <div className="w-10 h-10 rounded-full border-gray-500 border-2 bg-white flex items-center justify-center overflow-hidden">
                        <User className="text-gray-500 w-6 h-6" />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Searchbar;
