import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Searchbar from '../components/navbar';
import { useUser } from '../context/UserContext';
import PlaceOrder from '../components/placeOrder';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircleIcon, Check , DiamondPlus} from 'lucide-react';


const dummyOrders = [
    {
        purchaseOrderid: 101,
        orderStatus: 1,
        deliveryDate: "2024-11-15",
        orderDate: "2024-11-01",
        quantity: 50.00,
        supplierID: 1,
        productid: 13
    },
    {
        purchaseOrderid: 102,
        orderStatus: 0,
        deliveryDate: "2024-11-20",
        orderDate: "2024-11-05",
        quantity: 30.00,
        supplierID: 1,
        productid: 14
    },
    // Add more dummy orders as needed
];

const dummySuppliers = [
    { supplierID: 1, supplierName: "Supplier A" },
    { supplierID: 2, supplierName: "Supplier B" },
    // Add more suppliers as needed
];

const Suppliers = () => {
    const [expandedSuppliers, setExpandedSuppliers] = useState({});
    const [expandedOrders, setExpandedOrders] = useState({});
    const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);

    const toggleSupplier = (supplierID) => {
        setExpandedSuppliers((prev) => ({
            ...prev,
            [supplierID]: !prev[supplierID]
        }));
    };

    const toggleOrder = (orderID) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderID]: !prev[orderID]
        }));
    };

    const { profile } = useUser();

    // Function to open and close the PlaceOrder form
    const openPlaceOrderForm = () => setIsPlaceOrderOpen(true);
    const closePlaceOrderForm = () => setIsPlaceOrderOpen(false);

    // Filter orders by supplierID
    const getSupplierOrders = (supplierID) => dummyOrders.filter(order => order.supplierID === supplierID);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 w-screen h-auto bg-gray-100">
                <Searchbar />
                {profile && profile.name ? (
                    <div className='flex-col h-auto w-auto'>
                        <h1 className="w-auto text-4xl font-bold pl-10 pt-5 pb-5 text-gray-700 text-center">Purchase Orders</h1>
                        <hr className="b-2 bg-gray-900 w-full" />
                        <div className='p-10'>
                            {/* Header with Place Order Button */}
                            <div className='w-auto flex flex-row items-center pl-10 pr-10'>
                                <h1 className="text-3xl font-semibold mb-10">Suppliers List</h1>
                                <button
                                    onClick={openPlaceOrderForm}
                                    className="btn btn-md border-none mb-6 bg-blue-500 text-white py-2 px-4 rounded font-bold ml-auto"
                                >
                                    Place Order <DiamondPlus/>
                                </button>
                            </div>

                            {/* Supplier List */}
                            <div className="p-6">
                                {dummySuppliers.map((supplier) => (
                                    <div key={supplier.supplierID} className="mb-6 bg-white p-6 rounded-lg shadow-lg">
                                        <div
                                            onClick={() => toggleSupplier(supplier.supplierID)}
                                            className="cursor-pointer text-xl font-semibold text-gray-700"
                                        >
                                            {supplier.supplierName}
                                        </div>

                                        {expandedSuppliers[supplier.supplierID] && (
                                            <div className="mt-4 space-y-4">
                                                {getSupplierOrders(supplier.supplierID).map((order) => (
                                                    <div key={order.purchaseOrderid} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
                                                        <div
                                                            onClick={() => toggleOrder(order.purchaseOrderid)}
                                                            className="cursor-pointer text-lg font-semibold text-gray-600"
                                                        >
                                                            Order ID: {order.purchaseOrderid} (Status: {order.orderStatus ? "Completed" : "Pending"})
                                                        </div>

                                                        {expandedOrders[order.purchaseOrderid] && (
                                                            <div className="mt-2">
                                                                <table className="w-full border-collapse bg-white">
                                                                    <thead>
                                                                        <tr className="border-b-2 border-gray-200 bg-gray-100">
                                                                            <th className="p-2 text-left font-semibold">Product ID</th>
                                                                            <th className="p-2 text-left font-semibold">Quantity</th>
                                                                            <th className="p-2 text-left font-semibold">Order Date</th>
                                                                            <th className="p-2 text-left font-semibold">Delivery Date</th>
                                                                            <th className="p-2 text-left font-semibold">Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr className="border-b border-gray-200">
                                                                            <td className="p-2 text-gray-700">{order.productid}</td>
                                                                            <td className="p-2 text-gray-700">{order.quantity}</td>
                                                                            <td className="p-2 text-gray-700">{order.orderDate}</td>
                                                                            <td className="p-2 text-gray-700">{order.deliveryDate}</td>
                                                                            <td className="p-2 text-gray-700">{order.orderStatus ? "Completed" : "Pending"}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
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

                {/* PlaceOrder component - renders if `isPlaceOrderOpen` is true */}
                {isPlaceOrderOpen && <PlaceOrder onClose={closePlaceOrderForm} />}
            </div>
        </div>
    );
};

export default Suppliers;
