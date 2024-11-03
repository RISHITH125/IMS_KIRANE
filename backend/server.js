require('dotenv').config();
const mysql = require('mysql2');
const prompt = require('prompt-sync')();

const { createUser } = require('./createUser.js');

const { addProduct } = require('./addProduct.js')

const { testSales } = require('./testSales.js');

const { productSaleUpdate, afterPurchaseUpdate } = require('./sales.js');

const { promptPurchase } = require('./purchaseOrder.js');

// ad hoc login 
// const genpool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }).promise()

// pool = createUser(genpool); 

// productSaleUpdate(pool);  // adding the trigger
// afterPurchaseUpdate(pool); // adding the trigger

// addProduct(pool)

// testSales(pool)

// promptPurchase(pool)

// del_user(pool, 'ytrewq')

(async () => {
    try {
        // Create a MySQL connection pool
        const genpool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }).promise();

        // Create user and get pool if needed
        const pool = await createUser(genpool);

        // Add triggers
        // await productSaleUpdate(pool);  // Adding the trigger
        // await afterPurchaseUpdate(pool); // Adding the trigger

        // Execute other operations in order
        // await addProduct(pool);
        // await testSales(pool);
        await promptPurchase(pool);

        console.log('All operations completed successfully.');

    } catch (err) {
        console.error('An error occurred:', err);
    }
})();