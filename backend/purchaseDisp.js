// This is to display in express the purchase Order details

module.exports = {
    purchaseDisp: async function(pool, storeName) {
        try {
            console.log(storeName)
            await pool.query(`USE \`${storeName}\`;`);
            const [rows] = await pool.query(`
                SELECT 
                    P.orderStatus, 
                    P.deliveryDate, 
                    P.orderDate, 
                    P.quantity, 
                    S.supplierName, 
                    pr.productName 
                FROM 
                    purchaseOrder AS P 
                JOIN 
                    product AS pr ON P.productid = pr.productid 
                JOIN 
                    supplier AS S ON P.supplierID = S.supplierID;

            `);
            return rows;
        } catch (err) {
            console.error("Error in displaying purchaseOrder info: ", err);
        }
    }
}