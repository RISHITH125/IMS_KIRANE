import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Calendar } from 'lucide-react';

const AddProductForm = ({ onClose, suppliers, onAddProduct }) => {
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        supplierName: '',
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
                        <label className="block font-semibold mb-1">Supplier Name</label>
                        <select
                            name="supplierName"
                            value={formData.supplierName}
                            onChange={handleChange}
                            required
                            className="select select-sm select-bordered w-full bg-gray-100"
                        >
                            <option value="" disabled>
                                Select a Supplier
                            </option>
                            {suppliers.map((supplier,index) => (
                                <option key={supplier.supplierID} value={supplier.supplierName}>
                                    {supplier.supplierName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Expiry Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleChange}
                                required
                                className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                            />
                            <Calendar className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Date Added</label>
                        <input
                            type="text"
                            name="dateadded"
                            value={formData.dateadded}
                            readOnly
                            className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-md border-none bg-blue-500 text-white py-2 px-4 rounded font-bold w-full"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
