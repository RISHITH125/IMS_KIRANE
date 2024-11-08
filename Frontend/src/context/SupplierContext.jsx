import React, { createContext, useContext, useState, useEffect } from 'react';

const SuppliersContext = createContext();

export const SuppliersProvider = ({ children }) => {
    const [suppliers, setSuppliers] = useState(() => {
        // Load initial suppliers from localStorage or use a default value
        const savedSuppliers = localStorage.getItem('suppliers');
        return savedSuppliers ? JSON.parse(savedSuppliers) : [
            {
                supplierID: 1,
                supplierName: "Supplier A",
                address: "123 Main St, Springfield",
                phoneNumbers: ["123-456-7890", "098-765-4321"],
                emails: ["contact@supplierA.com", "support@supplierA.com"],
            },
            {
                supplierID: 2,
                supplierName: "Supplier B",
                address: "456 Elm St, Gotham",
                phoneNumbers: ["234-567-8901"],
                emails: ["info@supplierB.com"],
            },
            {
                supplierID: 3,
                supplierName: "Supplier C",
                address: "789 Maple St, Metropolis",
                phoneNumbers: ["345-678-9012", "210-987-6543"],
                emails: ["sales@supplierC.com", "help@supplierC.com"],
            },
        ];
    });

    // Save suppliers to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('suppliers', JSON.stringify(suppliers));
    }, [suppliers]);

    const addSupplier = (newSupplier) => {
        setSuppliers((prevSuppliers) => [
            ...prevSuppliers,
            { supplierID: prevSuppliers.length + 1, ...newSupplier },
        ]);
    };

    return (
        <SuppliersContext.Provider value={{ suppliers, setSuppliers, addSupplier }}>
            {children}
        </SuppliersContext.Provider>
    );
};

export const useSuppliers = () => useContext(SuppliersContext);
