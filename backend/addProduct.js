// Function to prompt user input
const { productCreate, categoryAdd, supplierAdd } = require('./product.js')


module.exports = {
    addProduct: async function(pool) {
        // Create a readline interface for user input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

        try {
            // Prompt for product details
            const productID = await prompt('Enter product ID: ');
            const productName = await prompt('Enter product name: ');
            const price = await prompt('Enter price: ');
            const expiryDate = await prompt('Enter expiry date (YYYY-MM-DD): ');
            const supplierId = await prompt('Enter supplier ID: ');
            const categoryId = await prompt('Enter category ID: ');
            const quantity = await prompt('Enter quantity: ');
            const reorderLevel = await prompt('Enter reorder level: ');

            // Call the productCreate function
            await productCreate(pool, productID, productName, price, expiryDate, supplierId, categoryId, quantity, reorderLevel);

            console.log("Product added successfully!");

            // Prompt for supplier details
            const supplierID = await prompt('Enter supplier ID: ');
            const address = await prompt('Enter address: ');
            const supplierName = await prompt('Enter supplier name: ');

            // Multivalued attributes for phone numbers and emails
            const phnoCount = await prompt('How many phone numbers to add?: ');
            let phno = [];
            for (let i = 0; i < phnoCount; i++) {
                phno.push(await prompt(`Enter phone number ${i + 1}: `));
            }

            const emailCount = await prompt('How many emails to add?: ');
            let email = [];
            for (let i = 0; i < emailCount; i++) {
                email.push(await prompt(`Enter email ${i + 1}: `));
            }

            // Call the supplierAdd function
            await supplierAdd(pool, supplierID, address, supplierName, phno, email);

            console.log("Supplier details added successfully!");

            // Prompt for category details
            const categoryID = await prompt('Enter category ID: ');
            const description = await prompt('Enter description: ');
            const categoryName = await prompt('Enter category name: ');

            // Call the categoryAdd function
            await categoryAdd(pool, categoryID, description, categoryName);

            console.log("Category added successfully!");

        } catch (err) {
            console.error('Error adding product, supplier, or category:', err.message);
        } finally {
            rl.close();  // Close the readline interface
        }
    }
}
