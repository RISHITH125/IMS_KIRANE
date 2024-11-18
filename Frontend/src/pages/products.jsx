import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Searchbar from '../components/navbar';
import AddProductForm from '../components/addproductform';
import { useUser } from '../context/UserContext';
import { useProducts } from '../context/ProductsContext';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircleIcon, Check } from 'lucide-react';
import { useSuppliers } from '../context/SupplierContext';

const Categories = () => {
  const [openCategories, setOpenCategories] = useState({});
  const [newProducts, setNewProducts] = useState([]);
  const [updatedItems, setUpdatedItems] = useState({});
  const [quantityInput, setQuantityInput] = useState({});
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { suppliers } = useSuppliers();

  const [tempsuppliers, setTempSuppliers] = useState();



  const { profile } = useUser();

  const { productsData, setProductsData } = useProducts();






  const [filteredProducts, setFilteredProducts] = useState(productsData);


  useEffect(() => {
    setFilteredProducts(productsData)
  }, [productsData]);

  useEffect(() => {
    if(suppliers.length > 0){
      setTempSuppliers(suppliers)
    }
    else{
      setTempSuppliers(localStorage.getItem('suppliers') ? JSON.parse(localStorage.getItem('suppliers')) : [])
    }
  },[suppliers])



  const handleAddProduct = (newProduct) => {
    setNewProducts((prevProducts) => [...prevProducts, newProduct]);
    const existingProduct = productsData.find(product =>
      product.categoryName.toLowerCase() === newProduct.categoryName.toLowerCase()
    );
    const categoryNameToUse = existingProduct ? existingProduct.categoryName : newProduct.categoryName;
    const productWithCorrectCategory = {
      ...newProduct,
      categoryName: categoryNameToUse
    };
    const isProductExisting = productsData.some(product =>
      product.categoryName === categoryNameToUse && product.productName === newProduct.productName
    );
    if (!isProductExisting) {
      const updatedProducts = [...productsData, productWithCorrectCategory];
      setProductsData(updatedProducts);
      // Store updated products data in local storage
      localStorage.setItem('productsData', JSON.stringify(updatedProducts));
    } else {
      console.log(`Product '${newProduct.productName}' in category '${categoryNameToUse}' already exists`);
    }
  };


  // console.log('productsData:', productsData);
  // console.log('filteredProducts:', filteredProducts);

  // const groupedProducts = (filteredProducts.length > 0 ? filteredProducts : productsData).reduce((acc, product) => {
  //   if (!acc[product.categoryName]) {
  //     acc[product.categoryName] = [];
  //   }
  //   acc[product.categoryName].push(product);
  //   return acc;
  // }, {});

  // const groupedProducts = (Array.isArray(filteredProducts) && filteredProducts.length > 0 ? filteredProducts : productsData || []).reduce((acc, product) => {
  //   // Check if product is an object and has a categoryName
  //   if (typeof product === 'object' && product !== null && product.categoryName) {
  //       if (!acc[product.categoryName]) {
  //           acc[product.categoryName] = [];
  //       }
  //       acc[product.categoryName].push(product);
  //   } else {
  //       console.warn("Invalid product or missing categoryName:", product);
  //   }
  //   return acc;
  // }, {});

  // Ensure filteredProducts and productsData are defined and are arrays
  const productsToUse = Array.isArray(filteredProducts) && filteredProducts.length > 0 ? filteredProducts : Array.isArray(productsData) ? productsData : [];

// Log the products to use for debugging
  console.log("Products to use for grouping:", productsToUse);

// Group products by categoryName
  const groupedProducts = productsToUse.reduce((acc, product) => {
    // Check if product is an object and has a categoryName
    if (typeof product === 'object' && product !== null && product.categoryName) {
        if (!acc[product.categoryName]) {
            acc[product.categoryName] = [];
        }
        acc[product.categoryName].push(product);
    } else {
        console.warn("Invalid product or missing categoryName:", product);
    }
    return acc;
}, {});

// Log the grouped products for debugging
  console.log("Grouped Products:", groupedProducts);

  const toggleCategory = (categoryName) => {
    setOpenCategories((prevOpenCategories) => ({
      ...prevOpenCategories,
      [categoryName]: !prevOpenCategories[categoryName]
    }));
  };

  const handleQuantityInputChange = (productid, value) => {
    setQuantityInput((prevInput) => ({
      ...prevInput,
      [productid]: parseInt(value) || 0 // Set to 0 if input is empty or invalid
    }));
  };

  const handleQuantityChange = (productid, delta) => {
    setUpdatedItems((prevItems) => {
      const currentQuantity = prevItems[productid]?.quantity || productsData.find(prod => prod.productid === productid)?.quantity;
      const changeValue = quantityInput[productid] || 1;
      const newQuantity = currentQuantity + delta * changeValue;

      if (newQuantity < 0) return prevItems;

      return {
        ...prevItems,
        [productid]: {
          ...prevItems[productid],
          quantity: newQuantity
        }
      };
    });
  };

  // Transform `updatedItems` to array of JSON objects with `productid` and `quantity`
  const getUpdatedItemsArray = () => {
    return Object.entries(updatedItems).map(([productid, item]) => ({
      productid: parseInt(productid),
      quantity: item.quantity
    }));
  };

  // Example function to send `updatedItemsArray`
  const handleSubmit = async () => {
    const updatedItemsArray = getUpdatedItemsArray();
    const payload = {
      storename: profile?.storename,
      updatedItems: updatedItemsArray.length > 0 ? updatedItemsArray : [],
      newProducts: newProducts.length > 0 ? newProducts : [],
    };
    const payloadjson = JSON.stringify(payload);
    console.log('Payload:', payloadjson);
  
    try {
      const storename = profile?.storename;
      const response = await fetch(`http://localhost:3000/${storename}/newupdateprods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payloadjson,
      });
  
      const data = await response.json();
  
      if (data.result) {
        console.log('Data:', data.message);
        // Fetch the updated products data
        const fetchResponse = await fetch(`http://localhost:3000/${storename}/products`);
        if (!fetchResponse.ok) {
          throw new Error(`Error fetching updated products. Status: ${fetchResponse.status}`);
        }
        const fetchedData = await fetchResponse.json();
        if (fetchedData.result) {
          setProductsData(fetchedData.message);
          localStorage.setItem('productsData', JSON.stringify(fetchedData.message));
          console.log('Products data updated successfully.');
        }
      }
  
      // Reset states after successful update
      setUpdatedItems({});
      setNewProducts([]);
    } catch (error) {
      console.error('Error during submission or fetching updated products:', error);
    }
  };
  
  const openAddProductForm = () => setIsAddProductOpen(true);
  const closeAddProductForm = () => setIsAddProductOpen(false);

  const handleFilter = (filteredData) => {
    setFilteredProducts(filteredData);
  };


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 w-screen h-auto bg-gray-100">
        <Searchbar data={productsData} onFilter={handleFilter} />
        {profile ? (
          <div className='felx-col h-auto w-auto'>
            <h1 className='w-auto text-4xl font-bold pl-10 pt-5 pb-5 text-gray-700 text-center'>Products</h1>
            <hr className='b-2 bg-gray-900 w-full'></hr>
            <div className="p-10">
              <div className='w-auto flex flex-row'>
                <h1 className="text-3xl font-semibold mb-10">Categories</h1>
                <button onClick={openAddProductForm} className="btn  btn-md border-none mb-6 bg-blue-500 text-white py-2 px-4 rounded font-bold ml-auto">
                  Add Product <PlusCircleIcon />
                </button>
              </div>


              {Object.entries(groupedProducts).map(([categoryName, products]) => {
                // Check if any product in the category is new or updated
                const hasNewOrUpdatedProduct = products.some(
                  (product) =>
                    product.productid === "NewProduct" || updatedItems[product.productid]
                );

                return (
                  <div
                    key={categoryName}
                    className="mb-6 bg-white p-6 rounded-lg shadow-lg"
                  >
                    <div
                      onClick={() => toggleCategory(categoryName)}
                      className="cursor-pointer text-xl font-semibold text-gray-700 flex items-center"
                    >
                      {categoryName}
                      {hasNewOrUpdatedProduct && (
                        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    {openCategories[categoryName] && (
                      <div className="mt-4">
                        <table className="w-full border-collapse bg-gray-50">
                          <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-100">
                              <th className="p-2 text-left font-semibold">Product ID</th>
                              <th className="p-2 text-left font-semibold">Product Name</th>
                              <th className="p-2 text-left font-semibold">Price</th>
                              <th className="p-2 text-left font-semibold">Quantity</th>
                              <th className="p-2 text-left font-semibold">Reorder Level</th>
                              <th className="p-2 text-left font-semibold">Expiry Date</th>
                              <th className="p-2 text-left font-semibold">Date Added</th>
                              <th className="p-2 text-left font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product, index) => {
                              const quantity =
                                updatedItems[product.productid]?.quantity ??
                                product.quantity;

                              if (quantity <= 0) return null;

                              return (
                                <tr key={index} className="border-b border-gray-200">
                                  <td className="p-2 text-gray-700">{product.productid}</td>
                                  <td className="p-2 text-gray-700">{product.productName}</td>
                                  <td className="p-2 text-gray-700">${product.price.toFixed(2)}</td>
                                  <td className="p-2 text-gray-700">{quantity}</td>
                                  <td className="p-2 text-gray-700">{product.reorderLevel}</td>
                                  <td className="p-2 text-gray-700">{product.expiry}</td>
                                  <td className="p-2 text-gray-700">{product.dateadded}</td>
                                  <td className="p-2 text-gray-700">
                                    <div className="flex items-center">
                                      {product.productid !== "NewProduct" &&(
                                      <input
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        className="w-16 p-1 mr-2 border rounded text-center bg-white"
                                        value={quantityInput[product.productid] || ''}
                                        onChange={(e) => handleQuantityInputChange(product.productid, e.target.value)}
                                        disabled={product.productid === "NewProduct"} // Disable for new products
                                      />
                                      )
                                      }
                                      {/* Disable the buttons if it's a new product */}
                                      {product.productid !== "NewProduct" && (
                                        <>
                                          <button
                                            onClick={() => handleQuantityChange(product.productid, 1)}
                                            className="btn btn-sm bg-green-500 border-none hover:bg-green-600 text-white font-extrabold py-1 px-2 rounded text-center"
                                          >
                                            +
                                          </button>
                                          <button
                                            onClick={() => handleQuantityChange(product.productid, -1)}
                                            className="btn btn-sm bg-red-500 border-none hover:bg-red-600 text-white font-extrabold py-1 px-2 ml-2 rounded text-center"
                                          >
                                            -
                                          </button>
                                        </>
                                      )}
                                    </div>

                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className='flex w-auto'>
                <button onClick={handleSubmit} className="btn btn-md border-none mt-6 bg-blue-500 text-white py-2 px-4 rounded ml-auto mr-auto font-bold">
                  Submit Changes <Check />
                </button>
                {isAddProductOpen && <AddProductForm onClose={closeAddProductForm} suppliers={tempsuppliers} products={productsData} onAddProduct={handleAddProduct} />}
              </div>

            </div>

          </div>

        ) : (
          <div className="flex flex-col items-center justify-center p-10 h-auto w-full text-center bg-gray-100">
            <h1 className="text-xl font-semibold text-gray-600 mb-4">You have not signed in</h1>
            <Link to="/auth" className="text-blue-500 hover:underline flex items-center">
              <h1 className="text-xl font-semibold mb-10 flex items-center">
                Sign in <ArrowRight className='ml-2' />
              </h1>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;