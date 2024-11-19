import { useState, useEffect } from 'react';
import { Search, Bell, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser  } from '../context/UserContext';

const Searchbar = ({ data, onFilter }) => {
    const { profile } = useUser ();
    const [showAlerts, setShowAlerts] = useState(false);
    const [alertData, setAlertData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const fetchAlertsAndCheckExpiredProducts = async () => {
        setLoading(true);
        try {

            const expiredProductsResponse = await fetch(`http://localhost:3000/${profile.storename}/checkExpiredProducts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storename: profile.storename }),
            });
            if (!expiredProductsResponse.ok) throw new Error('Failed to check expired products');
            // const expiredProductsData = await expiredProductsResponse.json();
            // console.log('Expired Products:', expiredProductsData); // Handle expired products data as needed

            // Call the alerts API
            const alertsResponse = await fetch(`http://localhost:3000/${profile.storename}/alerts`);
            if (!alertsResponse.ok) throw new Error('Failed to fetch alerts');
            const alertsData = await alertsResponse.json();
            setAlertData(alertsData.data || []); // Update alert data

            // Call the checkExpiredProducts API
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profile.storename) {
            fetchAlertsAndCheckExpiredProducts(); // Fetch alerts and check expired products initially
            const intervalId = setInterval(fetchAlertsAndCheckExpiredProducts, 120000); // Fetch every 2 minutes

            return () => clearInterval(intervalId); // Clear interval on component unmount
        }
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
                    {alertData.length > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {alertData.length}
                        </span>
                    )}
                </button>
                {/* User Icon */}
                <Link to="/profile">
                    <User  className="text-gray-500" />
                </Link>
            </div>
            {showAlerts && (
                <div className="right-0 h-auto w-auto mt-auto bg-white shadow-lg rounded-lg p-4">
                    <h3 className="font-bold text-lg">Alerts</h3>
                    {loading ? (
                        <p>Loading alerts...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ul className=' flex flex-col mt-auto'> 
                            {alertData.map((alert,index) => (
                                <li key={index} className="py-2 border-b">
                                    {alert.productName} - Expiry Date: {alert.expiryDate}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Searchbar;