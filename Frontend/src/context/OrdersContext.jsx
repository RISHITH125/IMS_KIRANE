// import React, { createContext, useState, useEffect, useContext } from 'react';

// // Create a context for orders
// const OrdersContext = createContext();

// // Provider component to wrap the app and provide the orders state
// export const OrdersProvider = ({ children }) => {
//     // Initialize orders from localStorage or use default values
//     const [orders, setOrders] = useState(() => {
//         const savedOrders = localStorage.getItem('orders');
//         return savedOrders ? JSON.parse(savedOrders) : [
//             { purchaseOrderid: 101, orderStatus: 1, deliveryDate: "2024-11-15", orderDate: "2024-11-01", quantity: 50.0, supplierID: 1, productName: "Panner" },
//             { purchaseOrderid: 102, orderStatus: 0, deliveryDate: "2024-11-20", orderDate: "2024-11-05", quantity: 30.0, supplierID: 2, productName: "Tomato" }
//         ];
//     });

//     useEffect(() => {
//         // Sync orders to localStorage whenever the state changes
//         localStorage.setItem('orders', JSON.stringify(orders));
//     }, [orders]);

//     // Provide the orders state and setter function to the rest of the app
//     return (
//         <OrdersContext.Provider value={{ orders, setOrders }}>
//             {children}
//         </OrdersContext.Provider>
//     );
// };

// // Custom hook to access the orders context
// export const useOrders = () => {
//     return useContext(OrdersContext); // No need to define state here
// };/


import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for orders
const OrdersContext = createContext();

// Provider component to wrap the app and provide the orders state
export const OrdersProvider = ({ children, storename }) => { // Accept storename as a prop
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!storename) {
                console.error("Store name is not available");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/${storename}/purchaseOrders`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setOrders(data.data);
                    localStorage.setItem('orders', JSON.stringify(data.data)); // Save to localStorage
                } else {
                    setError("Failed to fetch orders");
                }
            } catch (error) {
                console.error("Error fetching purchase orders:", error);
                setError("Error fetching purchase orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [storename]); // Dependency array includes storename

    // Sync orders to localStorage whenever the state changes
    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    // Provide the orders state, loading state, error state, and setter function to the rest of the app
    return (
        <OrdersContext.Provider value={{ orders, loading, error, setOrders }}>
            {children}
        </OrdersContext.Provider>
    );
};

// Custom hook to access the orders context
export const useOrders = () => {
    return useContext(OrdersContext); // No need to define state here
};
