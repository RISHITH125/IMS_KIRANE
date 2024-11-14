import React, { createContext, useContext, useState, useEffect } from "react";
// import { useUser } from "./UserContext";
const SuppliersContext = createContext();

export const SuppliersProvider = ({children}) => {
    const [suppliers, setSuppliers] = useState([]);
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
