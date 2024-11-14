import React, { useState } from 'react';

const AddSalesForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantitySold: '',
    salesPrice: '',
    paymentMethod: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/${storename}/sales`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
        setMessage('Sale added successfully');
    } else {
        setMessage(`Error: ${data.message}`);
    }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1 text-gray-600">Product Name</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1 text-gray-600">Quantity Sold</label>
        <input
          type="number"
          name="quantitySold"
          value={formData.quantitySold}
          onChange={handleChange}
          required
          className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1 text-gray-600">Sales Price</label>
        <input
          type="number"
          name="salesPrice"
          value={formData.salesPrice}
          onChange={handleChange}
          required
          className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
        />
      </div>

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
