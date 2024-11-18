module.exports = {
    newProdAdd: async function (pool, storename, productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierID, purchaseOrderid, supplierName) {
        try {
            // SQL query for inserting new product details
            await pool.query(`USE \`${storename}\`;`);
            const query = `
                INSERT INTO newProductPurchase (productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierName)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            // Execute the query using the provided parameters
            const [result] = await pool.execute(query, [
                productName,
                price,
                categoryName,
                reorderLevel,
                expiry,
                orderDate,
                quantity,
                supplierID,
                purchaseOrderid,
                supplierName
            ]);

            // Return the result (insert ID or confirmation of success)
            return { success: true, message: "Product added successfully", insertId: result.insertId };
            
        } catch (error) {
            // Handle errors
            console.error("Error adding product:", error);
            return { success: false, message: "Failed to add product", error: error.message };
        }
    }
}
