// This is code to fetch the newProductPurchase details for a new product purchase order

module.exports = {
    fetchNewProdPurchase: async function (pool, storename, productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierID, supplierName) {
        try {
            await pool.query(`USE \`${storename}\`;`);
            const [rows] = await pool.query(
                `SELECT productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierID, supplierName
                 FROM newProductPurchase
                 WHERE purchaseOrderid = ?;`,
                [productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierID, supplierName] // Added productid here
            );
            return {
                success: true,
                message: rows
            }
        } catch(err) {
            console.error("Error while inserting purchase...", err);
            return {
                success: false,
                message: "database error while fetching new product purchase details"
            }
        }
    }
}