// PlaceOrder.js
import React, { useState } from 'react';

const PlaceOrder = ({ onClose }) => {
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    const handleSubmitOrder = () => {
        // Logic to handle the order placement
        console.log({
            supplier: selectedSupplier,
            product: selectedProduct,
            quantity,
            deliveryDate,
        });
        onClose(); // Close the form after placing the order
    };

    return (
        <div className="p-4 bg-white rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Place New Order</h2>
            <div>
                {/* Supplier Selection */}
                <label>Supplier:</label>
                <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                    <option value="">Select Supplier</option>
                    <option value="1">Supplier A</option>
                    <option value="2">Supplier B</option>
                    {/* Add more suppliers dynamically if available */}
                </select>
            </div>
            <div>
                {/* Product Selection */}
                <label>Product:</label>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                    <option value="">Select Product</option>
                    <option value="13">Product 13</option>
                    <option value="14">Product 14</option>
                    {/* Add more products dynamically if available */}
                </select>
            </div>
            <div>
                {/* Quantity */}
                <label>Quantity:</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>
            <div>
                {/* Delivery Date */}
                <label>Delivery Date:</label>
                <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>
            <div className="mt-4 flex justify-end">
                <button onClick={handleSubmitOrder} className="btn btn-md bg-blue-500 text-white rounded px-4 py-2">
                    Submit Order
                </button>
                <button onClick={onClose} className="btn btn-md bg-gray-500 text-white rounded px-4 py-2 ml-2">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PlaceOrder;
