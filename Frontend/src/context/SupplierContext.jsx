import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
const SuppliersContext = createContext();

export const SuppliersProvider = ({ children}) => {
    const [suppliers, setSuppliers] = useState([]);
    const { profile, setProfile } = useUser();
    const storename=profile?.storename;
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
               
                // Perform a GET request to fetch suppliers
                const response = await fetch(`http://localhost:3000/${storename}/suppliers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                // console.log(response)

                if (response.ok) {
                    const data = await response.json();

                    // console.log(data)
                    if (data.success) {
                        // Update suppliers state with the fetched data
                        setSuppliers(data.data);
                    } else {
                        console.error("Failed to fetch suppliers:", data.data);
                    }
                } else {
                    console.error("Error fetching suppliers. Status:", response.status);
                }
            } catch (error) {
                console.error("Error during fetchSuppliers:", error);
            }
        };

        fetchSuppliers();
    }, [storename]);

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
