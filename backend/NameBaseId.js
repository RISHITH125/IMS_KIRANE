module.exports = {
    categoryNametoID: async function (pool, categoryName) {
        try {
            const [rows] = await pool.query(`
                SELECT categoryID FROM category WHERE categoryName = ?
            `, [categoryName]);
            
            // Check if a row was returned and return the categoryID
            return rows.length > 0 ? rows[0].categoryID : null; // Return the ID or null if not found
        } catch (err) {
            console.error('Error fetching category ID:', err);
        }
    },

    supplierNametoID: async function(pool, supplierName) {
        try {
            const [rows] = await pool.query(`
                SELECT supplierID FROM supplier WHERE supplierName = ?
            `, [supplierName]);

            // Check if a row was returned and return the supplierID
            return rows.length > 0 ? rows[0].supplierID : null; // Return the ID or null if not found
        } catch (err) {
            console.error('Error fetching supplier ID:', err);
        }
    }
}
