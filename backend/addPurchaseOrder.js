// This is code to add purchase details of the kirana owner from the suppliers.

module.exports = {
    addPurchase: async function (pool, orderStatus, deliveryDate, orderDate, quantity, supplierID, productid) {
        try {
            const [rows] = await pool.query(
                `INSERT INTO purchaseOrder (orderStatus, deliveryDate, orderDate, quantity, supplierID, productid) VALUES (?, ?, ?, ?, ?, ?)`,
                [orderStatus, deliveryDate, orderDate, quantity, supplierID, productid] // Added productid here
            );
            console.log('Purchase details added successfully:', rows);
            return {
                success: true,
                message: "Purchase Order details inserted"
            }
        } catch(err) {
            console.error("Error while inserting purchase...", err);
            return {
                success: false,
                message: "database error while inserting purchase order details"
            }
        }
    }
}