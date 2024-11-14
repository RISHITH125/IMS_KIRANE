import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
const SalesRecord = () => {
    const [salesData, setSalesData] = useState([]);
    const {profile}=useUser()
    const storename=profile?.storename
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // Fetch sales data for the specific store
        const fetchSales = async () => {
            try {
                const response = await fetch(`http://localhost:3000/${storename}/sales`);
                const data = await response.json();
                console.log(data)
                if (data.success) {
                    setSalesData(data.data);  // Assuming 'data' contains the sales records
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Error fetching sales records');
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [storename]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sales Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Product ID</th>
                            <th className="px-4 py-2 text-left">Quantity Sold</th>
                            <th className="px-4 py-2 text-left">Sales Price</th>
                            <th className="px-4 py-2 text-left">Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.length > 0 ? (
                            salesData.map((sale, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">{sale.productid}</td>
                                    <td className="px-4 py-2">{sale.quantitySold}</td>
                                    <td className="px-4 py-2">${sale.salesPrice}</td>
                                    <td className="px-4 py-2">{sale.paymentMethod}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-2 text-center text-gray-600">
                                    No sales records available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesRecord;
