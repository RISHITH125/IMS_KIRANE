import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PlaceOrder = ({ onClose, suppliers, products, onPlaceOrder, maxOrderID }) => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [formData, setFormData] = useState([
        {
            purchaseOrderid: null, // Start with no purchaseOrderid
            deliveryDate: '',
            orderDate: new Date().toISOString().split('T')[0],
            quantity: '',
            supplierID: '',
            supplierName: '',
            productid: '',
            productName: '',
            price: '',
            categoryName: '',
            reorderLevel: '',
            expiry: '',
            isNewProduct: false,
            orderStatus: 0,
        },
    ]);
    const [totalProducts, setTotalProducts] = useState(1);
    const [isDeliveryDateStep, setIsDeliveryDateStep] = useState(false);
    const [purchaseOrderidMap, setPurchaseOrderidMap] = useState(new Map()); // Map to track purchaseOrderid per supplier

    // Function to generate a unique purchaseOrderid for each supplier
    const generateUniquePurchaseOrderid = (supplierID) => {
        // Get the current purchaseOrderid for this supplier from the map
        let newOrderID = purchaseOrderidMap.get(supplierID) || maxOrderID + 1;

        // Increment the order ID until we find a unique one
        while (purchaseOrderidMap.has(newOrderID)) {
            newOrderID++;
        }

        // Store the new purchaseOrderid for this supplier
        setPurchaseOrderidMap((prevMap) => new Map(prevMap).set(supplierID, newOrderID));

        return newOrderID;
    };

    // Handle form field changes by updating current product data
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData((prevData) => {
            // Check if the name is 'deliveryDate', to apply it to all products
            if (name === 'deliveryDate') {
                // If it's the delivery date, update it for all products
                return prevData.map(product => ({
                    ...product,
                    [name]: value
                }));
            } else {
                // Otherwise, update the value for the current product based on index
                const updatedData = [...prevData];
                updatedData[currentProductIndex][name] = value;
                return updatedData;
            }
        });
    };
    

    const handleAddProductFields = () => {
        setFormData((prevData) => [
            ...prevData,
            {
                purchaseOrderid: formData[currentProductIndex].purchaseOrderid,  // Keep the same purchaseOrderid for all products
                deliveryDate: '',
                orderDate: new Date().toISOString().split('T')[0],
                quantity: '',
                supplierID: formData[currentProductIndex].supplierID,
                supplierName: formData[currentProductIndex].supplierName,
                productid: '',
                productName: '',
                price: '',
                categoryName: '',
                reorderLevel: '',
                expiry: '',
                isNewProduct: false,
            },
        ]);
        setTotalProducts((prev) => prev + 1);
        setCurrentProductIndex((prev) => prev + 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isDeliveryDateStep) {
            onPlaceOrder(formData);
            console.log(formData);
            onClose();
        } else {
            setIsDeliveryDateStep(true); // Transition to delivery date step
        }
    };

    const handleSupplierChange = (e) => {
        const selectedSupplierID = e.target.value;
        const selectedSupplier = suppliers.find(s => s.supplierID === parseInt(selectedSupplierID));

        // Generate unique purchaseOrderid for this supplier
        const newpurchaseOrderid = generateUniquePurchaseOrderid(selectedSupplier?.supplierID);

        setFormData((prevData) => {
            const updatedData = [...prevData];
            updatedData[currentProductIndex] = {
                ...updatedData[currentProductIndex],
                supplierID: selectedSupplier?.supplierID,
                supplierName: selectedSupplier?.supplierName,
                purchaseOrderid: newpurchaseOrderid,
            };
            return updatedData;
        });
    };

    const handlePreviousProduct = () => {
        if (currentProductIndex > 0) {
            setCurrentProductIndex(currentProductIndex - 1);
        }
    };

    const handleNextProduct = () => {
        if (currentProductIndex < totalProducts - 1) {
            setCurrentProductIndex(currentProductIndex + 1);
        }
    };

    // Disable "Add Another Product" button if fields are not filled
    const isAddProductDisabled = () => {
        const currentProduct = formData[currentProductIndex];
        if(!formData[currentProductIndex].isNewProduct)
        return !(currentProduct.quantity && currentProduct.supplierName && currentProduct.productid);
        else
        return !(currentProduct.productName && currentProduct.quantity && currentProduct.supplierID && currentProduct.price && currentProduct.categoryName && currentProduct.reorderLevel);
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96 max-h-[85vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                    <AiOutlineCloseCircle size={24} />
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-600">
                    {isDeliveryDateStep ? 'Enter Delivery Date' : 'Place New Order'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isDeliveryDateStep ? (
                        <>
                            <div>
                                <label className="block font-semibold mb-1">Supplier</label>
                                <select
                                    name="supplierID"
                                    value={formData[currentProductIndex].supplierID}
                                    onChange={handleSupplierChange}
                                    required
                                    className="input input-md input-bordered w-full p-2 border rounded bg-gray-100"
                                    disabled={totalProducts > 1}  // Disable after first product
                                >
                                    <option value="" disabled>Select Supplier</option>
                                    {suppliers.map((supplier,index) => (
                                        <option key={index} value={supplier.supplierID}>
                                            {supplier.supplierName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Product Selection */}
                            {!formData[currentProductIndex].isNewProduct && (
                                <div>
                                    <label className="block font-semibold mb-1">Product</label>
                                    <select
                                        name="productid"
                                        value={formData[currentProductIndex].productid}
                                        onChange={(e) => {
                                            const isNew = e.target.value === 'new';
                                            const SelectedProd = products.find(
                                                (p) => p.productid === parseInt(e.target.value)
                                            );
                                            setFormData((prevData) => {
                                                const updatedData = [...prevData];
                                                updatedData[currentProductIndex] = {
                                                    ...updatedData[currentProductIndex],
                                                    isNewProduct: isNew,
                                                    productid: isNew ? '' : SelectedProd?.productid,
                                                    productName: isNew ? '' : SelectedProd?.productName,
                                                    categoryName: isNew ? '' : SelectedProd?.categoryName,
                                                    reorderLevel: isNew ? '' : SelectedProd?.reorderLevel,
                                                    price: isNew ? '' : SelectedProd?.price,
                                                    expiry: isNew ? '' : SelectedProd?.expiry,
                                                };
                                                return updatedData;
                                            });
                                        }}
                                        required
                                        className="input input-md input-bordered w-full p-2 border rounded bg-gray-100"
                                    >
                                        <option value="" disabled>Select Product</option>
                                        {products.map((product) => (
                                            <option key={product.productid} value={product.productid}>
                                                {product.productName}
                                            </option>
                                        ))}
                                        <option value="new">Add New Product</option>
                                    </select>
                                </div>
                            )}
                            {formData[currentProductIndex].isNewProduct && (
                                <div>
                                    <div>
                                        <label className="block font-semibold mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            name="productName"
                                            value={formData[currentProductIndex].productName}
                                            onChange={handleChange}
                                            required
                                            className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData[currentProductIndex].price}
                                            onChange={handleChange}
                                            required
                                            className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">Category</label>
                                        <input
                                            type="text"
                                            name="categoryName"
                                            value={formData[currentProductIndex].categoryName}
                                            onChange={handleChange}
                                            required
                                            className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1">Reorder Level</label>
                                        <input
                                            type="number"
                                            name="reorderLevel"
                                            value={formData[currentProductIndex].reorderLevel}
                                            onChange={handleChange}
                                            required
                                            className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                                        />
                                    </div>
                                </div>
                            )}
                            {/* Quantity input */}
                            <div>
                                <label className="block font-semibold mb-1">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData[currentProductIndex].quantity}
                                    onChange={handleChange}
                                    required
                                    className="input input-sm input-bordered w-full p-2 border rounded bg-gray-100"
                                />
                            </div>

                            {/* Slide navigation */}
                            <div className="flex justify-between mt-4">
                                {currentProductIndex > 0 && (
                                    <button type="button" onClick={handlePreviousProduct} className="btn bg-gray-300">
                                        Previous
                                    </button>
                                )}
                                {currentProductIndex < totalProducts - 1 && (
                                    <button type="button" onClick={handleNextProduct} className="btn bg-gray-300">
                                        Next
                                    </button>
                                )}
                                {currentProductIndex === totalProducts - 1 && (
                                    <button
                                        type="button"
                                        onClick={handleAddProductFields}
                                        disabled={isAddProductDisabled()}
                                        className="btn bg-blue-500 text-white"
                                    >
                                        Add Another Product
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block font-semibold mb-1">Delivery Date</label>
                            <input
                                type="date"
                                name="deliveryDate"
                                value={formData[currentProductIndex].deliveryDate}
                                onChange={handleChange}
                                required
                                className="input input-md input-bordered w-full p-2 border rounded bg-gray-100"
                            /> 
                        </div>
                    )}

                    <button type="submit" className="btn w-full bg-green-500 text-white mt-6">
                        {isDeliveryDateStep ? 'Submit Order' : 'Next'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PlaceOrder;
