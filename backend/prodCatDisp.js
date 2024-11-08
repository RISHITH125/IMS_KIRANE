module.exports = {
    prodCatDisp: async function (pool) {
        try {
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
            `)
            return rows;
        } catch (err) {
            console.error('Some error occured while fetching category wise product details: ', err);
        }
    }
}