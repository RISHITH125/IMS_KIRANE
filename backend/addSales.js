module.exports = {
    addSales: async function(pool) {
        try {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            // Gather user input
            rl.question('Enter Product ID: ', async (productid) => {
                rl.question('Enter Quantity Sold: ', async (quantitySold) => {
                    rl.question('Enter Sales Price: ', async (salesPrice) => {
                        rl.question('Enter Payment Method (e.g., cash, card): ', async (paymentMethod) => {
    
                            // Convert to appropriate types
                            const productID = parseInt(productid);
                            const quantity = parseInt(quantitySold);
                            const price = parseFloat(salesPrice);
    
                            // Insert the sale into the sales table
                            try {
                                const [result] = await pool.query(`
                                    INSERT INTO sales (productid, quantitySold, salesPrice, paymentMethod)
                                    VALUES (?, ?, ?, ?)`,
                                    [productID, quantity, price, paymentMethod]
                                );
                                
                                console.log(`Sale record inserted successfully with ID: ${result.insertId}`);
                            } catch (err) {
                                console.error('Error inserting sale record:', err);
                            } finally {
                                rl.close();  // Close the readline interface after input
                            }
                        });
                    });
                });
            });
        } catch (err) {
            console.error('Error:', err);
            rl.close();
        }
    }
}