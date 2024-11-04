// UI 
const { addSales } = require('./addSales.js');
const prompt = require('prompt-sync')();

module.exports = {
    testSales: async function(pool) {
        try {
            // Gather user input using prompt-sync
            const productid = prompt('Enter Product ID: ');
            const quantitySold = prompt('Enter Quantity Sold: ');
            const salesPrice = prompt('Enter Sales Price: ');
            const paymentMethod = prompt('Enter Payment Method (e.g., cash, card): ');
    
            // Convert to appropriate types
            const productID = parseInt(productid);
            const quantity = parseInt(quantitySold);
            const price = parseFloat(salesPrice);
    
            // Insert the sale into the sales table
            try {
                await addSales(pool, productID, quantity, price, paymentMethod);
                console.log('Sale record inserted successfully.');
            } catch (err) {
                console.error('Error inserting sale record:', err);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }
}