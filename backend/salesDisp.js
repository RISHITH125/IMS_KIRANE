module.exports = {
    salesDisp: async function(pool, storename) {
        try {
            // Switch to the specified database
            await pool.query(`USE \`${storename}\`;`);
            
            // Query to display all sales records
            const [rows] = await pool.query(`
                SELECT 
                    salesid, 
                    productid, 
                    quantitySold, 
                    salesPrice, 
                    totalAmount, 
                    paymentMethod
                FROM 
                    sales;
            `);

            // Return the retrieved sales records
            return { success: true, message: "Sales records retrieved successfully", data: rows };

        } catch (error) {
            // Handle any errors
            console.error('Error retrieving sales records:', error);
            return { success: false, message: "Failed to retrieve sales records", error: error.message };
        }
    }
}
