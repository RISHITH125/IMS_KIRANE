import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Searchbar from '../components/navbar';
import { useUser } from '../context/UserContext';
import PlaceOrder from '../components/placeOrder';
import { Link } from 'react-router-dom';
import { ArrowRight, DiamondPlus, UserPlus, CheckSquare, ArrowBigDownDashIcon, ArrowBigUpDashIcon, Menu } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useOrders } from '../context/OrdersContext';
import AddSupplierForm from '../components/addSupplierform';
import { useSuppliers } from '../context/SupplierContext';

const Suppliers = () => {
    const { profile } = useUser();
    let storename = profile?.storename; // Declare storename at the top
    const { productsData } = useProducts();
    const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState([]);
    const { suppliers, setSuppliers } = useSuppliers();
    const [newOrder, setNewOrder] = useState([]);
    const { orders, setOrders } = useOrders();
    const [expandedSuppliers, setExpandedSuppliers] = useState({});
    const [expandedOrders, setExpandedOrders] = useState({});
    const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState([]);

    // Fetch suppliers
    useEffect(() => {
        const fetchSuppliers = async () => {
            if (!storename) {
                console.error("Store name is not available");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/${storename}/suppliers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setSuppliers(data.data);
                        localStorage.setItem('suppliers', JSON.stringify(data.data));
                    } else {
                        console.error('Failed to fetch suppliers:', data.data);
                    }
                } else {
                    console.error('Error fetching suppliers. Status:', response.status);
                }
            } catch (error) {
                console.error('Error during fetchSuppliers:', error);
            }
        };

        fetchSuppliers();
    }, [storename]);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!storename) {
                console.error('Store name is not available');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/${storename}/purchaseOrders`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setOrders(data.data);
                    localStorage.setItem('orders', JSON.stringify(data.data));
                } else {
                    console.error('Failed to fetch purchase orders');
                }
            } catch (error) {
                console.error('Error fetching purchase orders:', error);
            }
        };

        fetchOrders();
    }, [storename]);

    // Sync orders with localStorage
    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const maxOrderID = Math.max(...orders.map(o => o.purchaseOrderid), 0);
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



    // Open and Close the PlaceOrder form
    const openPlaceOrderForm = () => setIsPlaceOrderOpen(true);
    const closePlaceOrderForm = () => setIsPlaceOrderOpen(false);

    // Filter orders by supplierID
    // const getSupplierOrders = (supplierID) => orders.filter(order => order.supplierID === supplierID);

    // Calculate the max order ID


    const groupOrdersByPurchaseOrder = (orders) => {
        return orders.reduce((grouped, order) => {
            // Ensure purchaseOrderid exists and is a valid value
            const { purchaseOrderid } = order;
            if (purchaseOrderid === undefined) {
                console.warn('Order missing purchaseOrderid:', order); // Optional: log missing IDs
                return grouped; // Skip this order if no purchaseOrderid
            }

            if (!grouped[purchaseOrderid]) {
                grouped[purchaseOrderid] = [];
            }
            grouped[purchaseOrderid].push(order);

            return grouped;
        }, {});
    };

    const groupedOrders = groupOrdersByPurchaseOrder(filteredOrders.length > 0 ? filteredOrders : orders);

    const markOrderAsCompleted = (orderID) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.purchaseOrderid === orderID
                    ? { ...order, orderStatus: 1 }
                    : order
            )
        );
    };
    // Adding a new order
    const handleNewOrder = (orderData) => {
        setOrders((prevOrders) => [...prevOrders, ...orderData]);
        setNewOrder((prevOrders) => [...prevOrders, ...orderData]);
        localStorage.setItem('orders', JSON.stringify([...orders, ...orderData]));
        closePlaceOrderForm();
    };
    // console.log(orders);

    const handleAddSupplierPRE = (nSupplier) => {
        try {
            // Create a new supplier object
            const newSupplierObj = { supplierID: suppliers.length + 1, ...nSupplier };

            // Update the suppliers state
            const updatedSuppliers = [...suppliers, newSupplierObj];
            setSuppliers(updatedSuppliers);

            // Set the newSupplier state to the new supplier object
            setNewSupplier(newSupplierObj);

            // Call handleAddSupplier to send the new supplier to the backend
            handleAddSupplier(newSupplierObj); // Pass the new supplier object

        } catch (error) {
            console.error('Error adding supplier:', error);
        }
    };

    const handleAddSupplier = async (supplierData) => {
        try {
            // Prepare the data to send in the POST request
            const requestData = {
                newSuppliers: [supplierData], // Send the new supplier as an array
            };

            // Send POST request
            const storename = profile?.storename;
            const response = await fetch(`http://localhost:3000/${storename}/addSupplier`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`Failed to add supplier: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Server response:', result);

        } catch (error) {
            console.error('Error adding supplier:', error);
        }
    };

    const handleFilter = (filteredData) => {
        setFilteredOrders(filteredData);
        // console.log('filteredData:-', filteredData);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 w-screen h-auto bg-gray-100">
                <Searchbar data={orders} onFilter={handleFilter} />
                {profile ? (
                    <div className='flex-col h-auto w-auto'>
                        <h1 className="w-auto text-4xl font-bold pl-10 pt-5 pb-5 text-gray-700 text-center">Purchase Orders</h1>
                        <hr className="b-2 bg-gray-900 w-full" />
                        <div className='p-10'>
                            <div className='w-auto flex flex-row items-center'>
                                <h1 className="text-3xl font-semibold mb-10">Suppliers List</h1>
                                <button
                                    onClick={() => setIsAddSupplierOpen(true)}
                                    className="btn btn-md border-none mb-6 bg-orange-500 text-white py-2 px-4 rounded font-bold ml-auto mr-4"
                                >
                                    Add Supplier <UserPlus className='m-auto' />
                                </button>
                                <button
                                    onClick={openPlaceOrderForm}
                                    className="btn btn-md border-none mb-6 bg-blue-500 text-white py-2 px-4 rounded font-bold"
                                >
                                    Place Order <DiamondPlus className='m-auto' />
                                </button>
                            </div>

                            {/* <div className="">
                                {suppliers.map((supplier,index) => {
                                    // Check if this supplier has any orders in filteredOrders
                                    const supplierHasFilteredOrders = filteredOrders.some(order => order.supplierID === supplier.supplierID);

                                    // Only display the supplier and their orders if they have matching orders in filteredOrders
                                    if (filteredOrders.length > 0 && !supplierHasFilteredOrders) {
                                        return null; // Skip rendering this supplier if no orders are filtered for them
                                    }

                                    return (
                                        <div key={index} className="mb-6 bg-white p-6 rounded-lg shadow-lg">
                                            <div
                                                onClick={() => toggleSupplier(supplier.supplierID)}
                                                className="cursor-pointer text-xl font-semibold text-gray-700 flex items-center"
                                            >
                                                <span>{supplier.supplierName} </span>
                                                <Menu className='ml-2' />
                                            </div>

                                            {expandedSuppliers[supplier.supplierID] && (
                                                <div className="mt-4 space-y-4">
                                                    {Object.keys(groupedOrders).map((orderID) => {
                                                        const ordersForThisGroup = groupedOrders[orderID];
                                                        const isForThisSupplier = ordersForThisGroup.some(order => order.supplierID === supplier.supplierID);

                                                        if (isForThisSupplier) {
                                                            return (
                                                                <div key={orderID} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
                                                                    <div
                                                                        onClick={() => toggleOrder(orderID)}
                                                                        className="cursor-pointer text-lg font-semibold text-gray-600 flex items-center"
                                                                    >
                                                                        Order ID: {orderID} (Status: {ordersForThisGroup[0].orderStatus ? <span className='text-green-500'>Completed</span> : <span className='text-red-500'>Pending</span>})
                                                                        <span>{!expandedOrders[orderID] ? <ArrowBigDownDashIcon className='ml-5' /> : <ArrowBigUpDashIcon className='ml-5' />}</span>

                                                                        <button
                                                                            onClick={() => markOrderAsCompleted(parseInt(orderID))}
                                                                            className="bg-green-500 text-white py-1 px-2 rounded font-bold flex items-center ml-auto"
                                                                        >
                                                                            Order Received <CheckSquare className='ml-1' />
                                                                        </button>

                                                                    </div>

                                                                    {expandedOrders[orderID] && (
                                                                        <div className="mt-2">
                                                                            <table className="w-full border-collapse bg-white">
                                                                                <thead>
                                                                                    <tr className="border-b-2 border-gray-200 bg-gray-100">
                                                                                        <th className="p-2 text-left font-semibold">Product Name</th>
                                                                                        <th className="p-2 text-left font-semibold">Quantity</th>
                                                                                        <th className="p-2 text-left font-semibold">Order Date</th>
                                                                                        <th className="p-2 text-left font-semibold">Delivery Date</th>
                                                                                        <th className="p-2 text-left font-semibold">Status</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {ordersForThisGroup.map((order, index) => (
                                                                                        <tr key={index} className="border-b border-gray-200">
                                                                                            <td className="p-2 text-gray-700">{order.productName}</td>
                                                                                            <td className="p-2 text-gray-700">{order.quantity}</td>
                                                                                            <td className="p-2 text-gray-700">{order.orderDate}</td>
                                                                                            <td className="p-2 text-gray-700">{order.deliveryDate}</td>
                                                                                            <td className="p-2 text-gray-700">{order.orderStatus ? "Completed" : "Pending"}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                            </div> */}

<div className="">
    {(Array.isArray(suppliers) ? suppliers : []).map((supplier, index) => {
        // Check if this supplier has any orders in filteredOrders
        const supplierHasFilteredOrders = filteredOrders.some(order => order.supplierName === supplier.supplierName);

        // Only display the supplier and their orders if they have matching orders in filteredOrders
        if (filteredOrders.length > 0 && !supplierHasFilteredOrders) {
            return null; // Skip rendering this supplier if no orders are filtered for them
        }

        return (
            <div key={index} className="mb-6 bg-white p-6 rounded-lg shadow-lg">
                <div
                    onClick={() => toggleSupplier(supplier.supplierID)}
                    className="cursor-pointer text-xl font-semibold text-gray-700 flex items-center"
                >
                    <span>{supplier.supplierName} </span>
                    <Menu className='ml-2' />
                </div>

                                            {expandedSuppliers[supplier.supplierID] && (
                                                <div className="mt-4 space-y-4">
                                                    {Object.keys(groupedOrders).map((orderID) => {
                                                        const ordersForThisGroup = groupedOrders[orderID];
                                                        const isForThisSupplier = ordersForThisGroup.some(order => order.supplierID === supplier.supplierID);
                                                    
                                                        if (isForThisSupplier) {
                                                            return (
                                                                <div key={orderID} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
                                                                    <div
                                                                        onClick={() => toggleOrder(orderID)}
                                                                        className="cursor-pointer text-lg font-semibold text-gray-600 flex items-center"
                                                                    >
                                                                        Order ID: {orderID} (Status: {ordersForThisGroup[0].orderStatus ? <span className='text-green-500'>Completed</span> : <span className='text-red-500'>Pending</span>})
                                                                        <span>{!expandedOrders[orderID] ? <ArrowBigDownDashIcon className='ml-5' /> : <ArrowBigUpDashIcon className='ml-5' />}</span>
                                                            
                                                                        <button
                                                                            onClick={() => markOrderAsCompleted(parseInt(orderID))}
                                                                            className="bg-green-500 text-white py-1 px-2 rounded font-bold flex items-center ml-auto"
                                                                        >
                                                                            Order Received <CheckSquare className='ml-1' />
                                                                        </button>
                                                                    </div>
                                                            
                                                                    {expandedOrders[orderID] && (
                                                                        <div className="mt-2">
                                                                            <table className="w-full border-collapse bg-white">
                                                                                <thead>
                                                                                    <tr className="border-b-2 border-gray-200 bg-gray-100">
                                                                                        <th className="p-2 text-left font-semibold">Product Name</th>
                                                                                        <th className="p-2 text-left font-semibold">Quantity</th>
                                                                                        <th className="p-2 text-left font-semibold">Order Date</th>
                                                                                        <th className="p-2 text-left font-semibold">Delivery Date</th>
                                                                                        <th className="p-2 text-left font-semibold">Status</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {ordersForThisGroup.map((order, index) => (
                                                                                        <tr key={index} className="border-b border-gray-200">
                                                                                            <td className="p-2 text-gray-700">{order.productName}</td>
                                                                                            <td className="p-2 text-gray-700">{order.quantity}</td>
                                                                                            <td className="p-2 text-gray-700">{order.orderDate}</td>
                                                                                            <td className="p-2 text-gray-700">{order.deliveryDate}</td>
                                                                                            <td className="p-2 text-gray-700">{order.orderStatus ? "Completed" : "Pending"}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

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

                {isPlaceOrderOpen && (
                    <PlaceOrder
                        onClose={closePlaceOrderForm}
                        suppliers={suppliers}
                        products={productsData}
                        maxOrderID={maxOrderID}
                        onPlaceOrder={handleNewOrder}
                    />
                )}
                {isAddSupplierOpen && (
                    <AddSupplierForm
                        onClose={() => setIsAddSupplierOpen(false)}
                        onAddSupplier={handleAddSupplierPRE}
                    />
                )}
            </div>
        </div>
    );
};

export default Suppliers;