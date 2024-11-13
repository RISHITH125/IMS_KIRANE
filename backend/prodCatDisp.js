const mysql = require('mysql2');


module.exports = {
    prodCatDisp: async function (pool, storename) {
        try {
            // First, use the correct database
            await pool.query(`USE ${storename};`);

            // Now, run your SELECT query
            const [rows] = await pool.query(`
                SELECT 
                    C.categoryName, 
                    P.productName, 
                    P.price, 
                    P.quantity, 
                    P.reorderLevel, 
                    P.expiry, 
                    P.dateadded 
                FROM 
                    product AS P 
                JOIN 
                    category AS C ON P.categoryID = C.categoryID
                ORDER BY 
                    C.categoryName, P.productName ASC;
            `);

            return rows; // Return the result from the SELECT query
        } catch (err) {
            console.error('Some error occured while fetching category wise product details: ', err);
        }
    }
}
