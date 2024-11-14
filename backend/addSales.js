const { productNametoID } = require("./NameBaseId");

module.exports = {
    addSales: async function (pool, productName, quantity, price, paymentMethod, storename) {
        try {
            // Switch to the specified database
            await pool.query(`USE \`${storename}\`;`);
            
            // Get the product ID based on product name
            const productID = await productNametoID(pool, productName, storename);
            
            if (!productID) {
                return { success: false, message: `Product '${productName}' not found in store '${storename}'` };
            }
            
            // Insert the sale record
            const [result] = await pool.query(
                `INSERT INTO sales (productID, quantitySold, salesPrice, paymentMethod) VALUES (?, ?, ?, ?)`,
                [productID, quantity, price, paymentMethod]
            );
            
            // Return success message with the inserted sale ID
            return { success: true, message: "Sale record inserted successfully", insertId: result.insertId };
            
        } catch (err) {
            // Return error message if insertion fails
            console.error('Error inserting sale record:', err);
            return { success: false, message: "Failed to insert sale record", error: err.message };
        }
    }
};
