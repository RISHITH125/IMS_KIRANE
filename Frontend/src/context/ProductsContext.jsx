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
    // Initialize productsData from local storage or with Initial data
    const storedProducts = localStorage.getItem('productsData');
    if (storedProducts) {
      setProductsData(JSON.parse(storedProducts));
    } else {
      console.log('Fetching products data from the server');
      console.log(profile);
       async () => {

        try{
          const response = await fetch(`http://localhost:3000/${profile?.storename}/products`);
          const data = await response.json();
          console.log(data);
          if(data.result){
            setProductsData(data.message);
            localStorage.setItem('productsData', JSON.stringify(data.message));
          }
        }catch(err){
          console.error('Some error occured while fetching category wise product details: ', err);
  
        }
  
      };

    }
  }, []);

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
