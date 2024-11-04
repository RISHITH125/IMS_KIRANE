// src/pages/Products.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import Searchbar from '../components/navbar';
import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);

  const productsData = [
    { id: 1, name: "Rice", description: "5 kg bag of premium basmati rice", price: "$10.99" },
    { id: 2, name: "Wheat Flour", description: "10 kg bag of whole wheat flour", price: "$15.99" },
    { id: 3, name: "Cooking Oil", description: "1 liter bottle of sunflower oil", price: "$4.99" },
    { id: 4, name: "Sugar", description: "1 kg bag of refined sugar", price: "$2.99" },
    { id: 5, name: "Salt", description: "1 kg pack of iodized salt", price: "$1.50" },
    { id: 6, name: "Lentils", description: "1 kg pack of split red lentils", price: "$3.50" },
    { id: 7, name: "Tea", description: "250 g pack of Assam tea", price: "$3.75" },
    { id: 8, name: "Spices Mix", description: "100 g pack of mixed Indian spices", price: "$2.50" }
  ];
  
  useEffect(() => {
    setProducts(productsData);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Products Content */}
      <div className="flex-1 w-screen h-screen bg-gray-100">
        {/* Searchbar */}
        <Searchbar />

        <div className="p-10 bg-gray-100">
          <h1 className="text-4xl font-semibold mb-10 text-black">
            Products
          </h1>

          {/* Table Layout for Products */}
          <div className="overflow-auto rounded-lg shadow-lg">
            <table className="w-full bg-white">
              <thead className="bg-gray-200 border-b-2 border-gray-300">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700">Icon</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Description</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200">
                    <td className="p-4 text-gray-600">
                      <FaBoxOpen className="text-2xl" />
                    </td>
                    <td className="p-4 text-gray-800 font-semibold">{product.name}</td>
                    <td className="p-4 text-gray-600">{product.description}</td>
                    <td className="p-4 text-gray-800 font-bold">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Link to go back to Dashboard */}
          <div className="mt-10">
            <Link to="/dashboard" className="text-blue-500 hover:underline flex items-center">
              <h1 className="text-lg font-semibold flex items-center">
                Back to Dashboard
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
