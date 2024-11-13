import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Calendar } from 'lucide-react';

const AddProductForm = ({ onClose, suppliers, onAddProduct }) => {
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        supplierID: '',
        categoryName: '',
        quantity: '',
        reorderLevel: '',
        expiry: '',
        dateadded: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            ...formData,
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            productid: "NewProduct",
            categoryID: Math.floor(Math.random() * 1000)
        };
        console.log("New Product Data:", newProduct);
        onAddProduct(newProduct);
        onClose();
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96 max-h-[85vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                    <AiOutlineCloseCircle size={24} />
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-600">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {['productName', 'categoryName'].map((field) => (
                        <div key={field}>
                            <label className="block font-semibold mb-1">{field}</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                            />
                        </div>
                    ))}
                    {['price', 'quantity', 'reorderLevel'].map((field) => (
                        <div key={field}>
                            <label className="block font-semibold mb-1">{field}</label>
                            <input
                                type="number"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block font-semibold mb-1">Expiry Date</label>
                        <div className="flex items-center space-x-2">
                            <Calendar size={24} className="text-gray-500" />
                            <input
                                type="date"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleChange}
                                required
                                className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Supplier</label>
                        <select
                            name="supplierID"
                            value={formData.supplierID}
                            onChange={handleChange}
                            required
                            className="input input-md input-bordered w-full p-2 border rounded bg-gray-100 mb-2"
                        >
                            <option value="" disabled className="font-semibold text-gray-800">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.supplierID} value={supplier.supplierID}>{supplier.supplierName}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn border-none w-full bg-blue-500 text-white py-2 rounded font-bold">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
