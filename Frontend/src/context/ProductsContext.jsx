// src/context/ProductsContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [productsData, setProductsData] = useState([]);
  const { profile, setProfile } = useUser();

  // const mama=[
  //   {
  //     productID: 13,
  //     productName: "milk",
  //     price: 26,
  //     supplierID: 13,
  //     categoryID: 13,
  //     categoryName: "Dairy",
  //     quantity: 4,
  //     reorderLevel: 2,
  //     expiry: "2024-11-04T18:30:00.000Z",
  //     dateadded: "2024-11-02T18:30:00.000Z"
  //   },
  //   {
  //     productID: 14,
  //     productName: "Apples",
  //     price: 100,
  //     supplierID: 101,
  //     categoryID: 1,
  //     categoryName: "Fruits",
  //     quantity: 45,
  //     reorderLevel: 20,
  //     expiry: "2024-11-02T18:30:00.000Z"
  //   }
  //   // Add more initial products if needed
  // ]




  useEffect(() => {
    if (profile) {
      // console.log('Fetching products data for:', profile.storename);
  
      const fetchProductsData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/${profile.storename}/products`
          );
  
          // Check if the response is okay
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const responseData = await response.json();
          // console.log('Response data:', responseData);
          // Use the `response` variable to process data further
          if (responseData.result) {
            // console.log('Fetched data successfully:', responseData.message);
            const proddat=responseData.message

            setProductsData(proddat);
            localStorage.setItem('productsData', JSON.stringify(proddat));
          } else {
            console.warn('Data fetch was not successful:', responseData.message);
          }
        } catch (err) {
          console.error('Error fetching category-wise product details:', err);
        }
      };
  
      fetchProductsData();
    }
  }, [profile]); // Depend on profile
  

  const addProduct = (newProduct) => {
    const updatedProducts = [...productsData, newProduct];
    setProductsData(updatedProducts);
    localStorage.setItem('productsData', JSON.stringify(updatedProducts));
  };

  return (
    <ProductsContext.Provider value={{ productsData, setProductsData, addProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
