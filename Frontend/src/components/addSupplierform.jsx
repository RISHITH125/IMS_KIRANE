import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const AddSupplierForm = ({ onClose, onAddSupplier }) => {
    const [formData, setFormData] = useState({
        supplierName: '',
        address: '',
        phoneNumbers: [''],
        emails: ['']
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleMultiInputChange = (index, value, type) => {
        setFormData((prevData) => {
            const updatedArray = [...prevData[type]];
            updatedArray[index] = value;
            return { ...prevData, [type]: updatedArray };
        });
    };

    const addPhoneNumberField = () => {
        setFormData((prevData) => ({ ...prevData, phoneNumbers: [...prevData.phoneNumbers, ''] }));
    };

    const addEmailField = () => {
        setFormData((prevData) => ({ ...prevData, emails: [...prevData.emails, ''] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSupplier = { ...formData };
        console.log("New Supplier Data:", newSupplier);
        onAddSupplier(newSupplier);
        onClose();
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96 max-h-[85vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                    <AiOutlineCloseCircle size={24} />
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-600">Add New Supplier</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Supplier Name</label>
                        <input
                            type="text"
                            name="supplierName"
                            value={formData.supplierName}
                            onChange={handleChange}
                            required
                            placeholder="Enter supplier name"
                            className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter supplier address"
                            className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Phone Numbers</label>
                        {formData.phoneNumbers.map((phone, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => handleMultiInputChange(index, e.target.value, 'phoneNumbers')}
                                    placeholder="Enter phone number"
                                    className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                                />
                                {index === formData.phoneNumbers.length - 1 && (
                                    <button type="button" onClick={addPhoneNumberField} className="text-blue-500 font-bold">
                                        + Add
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Email Addresses</label>
                        {formData.emails.map((email, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleMultiInputChange(index, e.target.value, 'emails')}
                                    placeholder="Enter email address"
                                    className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                                />
                                {index === formData.emails.length - 1 && (
                                    <button type="button" onClick={addEmailField} className="text-blue-500 font-bold">
                                        + Add
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="btn border-none w-full bg-blue-500 text-white py-2 rounded font-bold">
                        Add Supplier
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSupplierForm;
