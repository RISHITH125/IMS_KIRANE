// UI
const { addPurchase } = require('./addPurchaseOrder.js');
const prompt = require('prompt-sync')();

module.exports = {
    promptPurchase: async function (pool) {
        try {
            // Prompt for purchase order details
            const orderStatus = parseInt(prompt('Enter order status (0 for pending, 1 for completed): '));
            const deliveryDate = prompt('Enter delivery date (YYYY-MM-DD): ');
            const orderDate = prompt('Enter order date (YYYY-MM-DD): ');
            const quantity = parseFloat(prompt('Enter quantity: '));
            const supplierID = parseInt(prompt('Enter supplier ID: '));
            const productid = parseInt(prompt('Enter product ID: '));

            await addPurchase(pool, orderStatus, deliveryDate, orderDate, quantity, supplierID, productid);
        } catch(err) {
            console.error("Some error occured while adding purchase details\n", err)
        }
    }
}