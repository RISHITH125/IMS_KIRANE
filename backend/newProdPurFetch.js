module.exports = {
    fetchNewProdPurchase: async function (pool, storename) {
        try {
            // Switch to the specified database
            await pool.query(`USE \`${storename}\`;`);

            // Fetch new product purchase details
            const [rows] = await pool.query(
                `SELECT productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierID, supplierName
                 FROM newProductPurchase`
            );

            // Return the fetched rows with a success message
            return {
                success: true,
                message: "New product purchases fetched successfully.",
                data: rows // Include the fetched data
            };
        } catch (err) {
            console.error("Error while fetching new product purchases...", err);
            return {
                success: false,
                message: "Database error while fetching new product purchase details."
            };
        }
    }
};