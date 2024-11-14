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
// const storename=profile?.storename
// Provider component to wrap the app and provide the orders state
export const OrdersProvider = ({ children}) => { // Accept storename as a prop
    const [orders, setOrders] = useState([]);
    // Provide the orders state, loading state, error state, and setter function to the rest of the app
    return (
        <OrdersContext.Provider value={{ orders,setOrders }}>
            {children}
        </OrdersContext.Provider>
    );
};

// Custom hook to access the orders context
export const useOrders = () => {
    return useContext(OrdersContext); // No need to define state here
};
