import { useState } from 'react';
import { Search, Bell, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
const Searchbar = ({ data, onFilter }) => {
    const { profile, setProfile } = useUser();

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
    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:YOUR_PORT/${profile.storename}/alerts`);
                if (!response.ok) throw new Error('Failed to fetch alerts');
                const data = await response.json();
                setAlerts(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [profile.storename]);

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
                {/* Alerts Icon */}
                <button
                    onClick={() => setShowAlerts(!showAlerts)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-200 hover:scale-105 transition-transform duration-300 relative"
                >
                    <Bell className="text-gray-500" />
                    {alerts.length > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {alerts.length}
                        </span>
                    )}
                </button>

                {/* Alerts Dropdown */}
                {showAlerts && (
                    <div className="absolute right-20 top-12 w-80 bg-white shadow-md rounded-lg border overflow-hidden z-50">
                        <div className="p-4">
                            <h3 className="text-lg font-bold">Alerts</h3>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {loading && <p className="p-4">Loading alerts...</p>}
                            {error && <p className="p-4 text-red-500">Error: {error}</p>}
                            {!loading && !error && alerts.length === 0 && (
                                <p className="p-4">No alerts found.</p>
                            )}
                            {!loading && !error && alerts.map((alert) => (
                                <div
                                    key={alert.alertID}
                                    className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                                >
                                    <p className="text-sm">
                                        <strong>Product:</strong> {alert.productName}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        <strong>Expiry:</strong> {alert.expiryDate}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        <strong>Alert:</strong> {alert.alertDate}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 text-center">
                            <button
                                className="text-sm text-blue-500 hover:underline"
                                onClick={() => setShowAlerts(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

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
