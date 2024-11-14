module.exports = {
    categoryNametoID: async function (pool, categoryName,storeName) {
        try {
            await pool.query(`USE \`${storeName}\`;`);
            const [rows] = await pool.query(`
                SELECT categoryID FROM category WHERE categoryName = ?
            `, [categoryName]);
            
            // Check if a row was returned and return the categoryID
            return rows.length > 0 ? rows[0].categoryID : null; // Return the ID or null if not found
        } catch (err) {
            console.error('Error fetching category ID:', err);
        }
    },

    supplierNametoID: async function(pool, supplierName, storeName) {
        try {
            await pool.query(`USE \`${storeName}\`;`);
            const [rows] = await pool.query(`
                SELECT supplierID FROM supplier WHERE supplierName = ?
            `, [supplierName]);

            // Check if a row was returned and return the supplierID
            return rows.length > 0 ? rows[0].supplierID : null; // Return the ID or null if not found
        } catch (err) {
            console.error('Error fetching supplier ID:', err);
        }
    }, 

    productNametoID: async function(pool, productName, storeName) {
        try {
            await pool.query(`USE \`${storeName}\`;`);
            const [rows] = await pool.query(`
                SELECT productid FROM product WHERE productName = ?
            `, [productName]);

            // Check if a row was returned and return the supplierID
            return rows.length > 0 ? rows[0].productid : null; // Return the ID or null if not found
        } catch (err) {
            console.error('Error fetching supplier ID:', err);
        }
    }
}
