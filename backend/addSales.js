module.exports = {
    addSales: async function( pool, productID, quantity, price, paymentMethod ) {
        try {
            const [result] = await pool.query(`
                INSERT INTO sales (productid, quantitySold, salesPrice, paymentMethod)
                VALUES (?, ?, ?, ?)`,
                [productID, quantity, price, paymentMethod]
            );
            
            console.log(`Sale record inserted successfully with ID: ${result.insertId}`);
        } catch (err) {
            console.error('Error inserting sale record:', err);
        }
    }
}