module.exports = {
    newProdAdd: async function (pool, storename, productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierID, supplierName, purchaseOrderid) {
        try {
            // Validate expiry date
            if (!expiry || expiry.trim() === "") {
                console.error("Expiry date is invalid:", expiry);
                throw new Error("Invalid expiry date provided.");
            }

            // Convert expiry to a valid date format if necessary
            const formattedExpiry = new Date(expiry);
            if (isNaN(formattedExpiry.getTime())) {
                throw new Error("Invalid expiry date format.");
            }

            await pool.query(`USE \`${storename}\`;`);
            const query = `
                INSERT INTO newProductPurchase (productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierID, supplierName)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            // Execute the query using the provided parameters
            const [result] = await pool.execute(query, [
                productid,
                productName,
                price,
                categoryName,
                reorderLevel,
                expiry,
                orderDate,
                quantity,
                supplierID,
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