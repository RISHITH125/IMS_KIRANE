import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const AddSalesForm = ({ products }) => {
  const { profile } = useUser();
  const storename = profile?.storename;
  const [formData, setFormData] = useState({
    productName: '',
    quantitySold: '',
    salesPrice: '',
    paymentMethod: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure the quantitySold is within limits
    if (name === 'quantitySold') {
      const selectedProduct = products.find((product) => product.productName === formData.productName);
      if (selectedProduct && parseInt(value) > selectedProduct.quantity) {
        alert(`Maximum quantity available is ${selectedProduct.quantity}`);
        return;
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:3000/${storename}/addsales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Sale added successfully');
      setFormData({
        productName: '',
        quantitySold: '',
        salesPrice: '',
        paymentMethod: '',
      });
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name Dropdown */}
      <div>
        <label className="block font-semibold mb-1 text-gray-600">Product Name</label>
        <select
          name="productName"
          value={formData.productName}
          onChange={(e) => {
            // Update sales price based on selected product
            const selectedProduct = products.find(
              (product) => product.productName === e.target.value
            );
            setFormData((prevData) => ({
              ...prevData,
              productName: e.target.value,
              salesPrice: selectedProduct?.price || '',
            }));
          }}
          required
          className="select select-sm select-bordered w-full p-2 border rounded bg-gray-100 h-auto"
        >
          <option value="" disabled>
            Select a product
          </option>
          {products.map((product,index) => (
            <option key={index} value={product.productName}>
              {product.productName}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity Sold */}
      <div>
        <label className="block font-semibold mb-1 text-gray-600 h-auto">Quantity Sold</label>
        <input
          type="number"
          name="quantitySold"
          value={formData.quantitySold}
          onChange={handleChange}
          required
          className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
        />
      </div>

      {/* Sales Price */}
      <div>
        <label className="block font-semibold mb-1 text-gray-600">Sales Price</label>
        <input
          type="number"
          name="salesPrice"
          value={formData.salesPrice}
          onChange={handleChange}
          required
          className="input input-sm input-bordered w-full p-2 border rounded bg-gray-200"
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block font-semibold mb-1 text-gray-600">Payment Method</label>
        <input
          type="text"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
          className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn bg-blue-500 text-white w-full py-2 rounded mt-4"
      >
        Add Sale
      </button>
    </form>
  );
};

export default AddSalesForm;
