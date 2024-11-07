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
            // need to be coded
            // const supplierName = prompt('Enter supplier name: ');
            // const productName = prompt('Enter product name: ');
            // const categoryName = prompt('Enter category name: ');
            // const supplierAddress = prompt('Enter supplier address')
            // const 

            await addPurchase(pool, orderStatus, deliveryDate, orderDate, quantity, supplierID, productid);
        } catch(err) {
            console.error("Some error occured while adding purchase details\n", err)
        }
    }
}