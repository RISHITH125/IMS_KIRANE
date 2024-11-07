const express = require('express');
require('dotenv').config();
// const mysql = require('mysql2');
const mysql = require('mysql2/promise');

const { createStoreDatabase } = require('./login.js')
const {dispSupplier} = require('./supplierDisp.js') 
const { purchaseDisp } = require('./purchaseDisp.js')
const { prodCatDisp } = require('./prodCatDisp.js')
const { productCreate, categoryAdd, updateProdQuant } = require('./product.js')
const { categoryNametoID, supplierNametoID } = require('./NameBaseId.js')

const app = express();
const port = 3000;

// Set up the MySQL connection pool
const genpool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// const pool = createStoreDatabase(genpool, 'lkjhg')

(async () => {
    // const auth = 

    const pool = await createStoreDatabase(genpool, 'lkjhg');

    // Ensure that `pool` is defined before setting up routes
    if (!pool) {
        console.error('Failed to create store database.');
        return;
    }

    // Route to fetch all product data
    app.get('/products', async (req, res) => {
        try {
            // Query to get all products
            const [rows] = await pool.query('SELECT * FROM product');
            // Directly send rows which contain key-value pairs for each column
            res.json(rows);
        } catch (error) {
            console.error('Error fetching product data:', error);
            res.status(500).send('Error fetching product data');
        }
    });

    // Start the Express server (assuming `app` is already defined)
    // const port = process.env.PORT || 3000;
    // Function to generate an HTML table
    function generateHtmlTable(rows, title = "Data Table") {
        if (rows.length === 0) return `<h1>No Data Available</h1>`;
    
        return `
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <table>
                        <tr>${Object.keys(rows[0]).map(key => `<th>${key}</th>`).join('')}</tr>
                        ${rows.map(row => `
                            <tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>
                        `).join('')}
                    </table>
                </body>
            </html>
        `;
    }
    
    // Route to fetch all product data
    app.get('/products', async (req, res) => {
        try {
            // Query to get all products
            const [rows] = await pool.query('SELECT * FROM product');
    
            // Directly send rows which contain key-value pairs for each column
            res.json(rows);
        } catch (error) {
            console.error('Error fetching product data:', error);
            res.status(500).send('Error fetching product data');
        }
    });
    
    // Route to display JSON data in a table format
    app.get('/products/table', async (req, res) => {
        try {
            // Query to get all products
            const [rows] = await pool.query('SELECT * FROM product');
    
            // Generate HTML table dynamically from rows with key-value pairs
            const html = generateHtmlTable(rows, "Product Information")
    
            // Send the HTML response
            res.send(html);
        } catch (error) {
            console.error('Error fetching product data:', error);
            res.status(500).send('Error fetching product data');
        }
    });
    
    // Route to add Product details into table
    app.post('/addProduct', async (req, res) => {
        try {
            const { productName, price, supplierName, categoryName, quantity, reorderLevel, expiry } = req.body;
    
            const categoryID = await categoryNametoID(pool, categoryName)
            const supplierID = await supplierNametoID(pool, supplierName)
    
            // Call a function to insert this data into the product table
            const result = await productCreate(pool, productID, productName, price, supplierID, categoryID, quantity, reorderLevel, expiry, dateadded);
    
            res.status(201).json({ message: 'Product added successfully', result });
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).send('Error adding product');
        }
    });
    
    
    // This is just for testing purposes
    app.get('/addProductTest', async (req, res) => {
        try {
            // Extract values from the query parameters
            const {
                productName,
                price,
                supplierName, // needs to be discussed: do you need to add address, phone number, email of the supplier? 
                categoryName,
                quantity,
                reorderLevel,
                expiry
            } = req.query;
    
            // Check if all required fields are provided
            if (!productName || !price || !supplierName || !categoryName || !quantity || !reorderLevel || !expiry) {
                return res.status(400).send('Missing required query parameters');
            }
    
            // Convert price, quantity, reorderLevel, and expiry to appropriate types
            const parsedPrice = parseInt(price, 10);
            const parsedQuantity = parseInt(quantity, 10);
            const parsedReorderLevel = parseInt(reorderLevel, 10);
            const parsedExpiry = new Date(expiry); // Ensure expiry is a date
    
            const categoryID = await categoryNametoID(pool, categoryName);
            const supplierID = await supplierNametoID(pool, supplierName);
    
            // Check if categoryID and supplierID were found
            if (categoryID === null) {
                await categoryAdd(pool, null, categoryName)
            }
            if (supplierID === null) {
                return res.status(404).send('Supplier not found');
            }
    
            // Call a function to insert this data into the product table
            const result = await productCreate(pool, productName, parsedPrice, supplierID, categoryID, parsedQuantity, parsedReorderLevel, parsedExpiry);
    
            res.status(201).json({ message: 'Product added successfully', result });
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).send('Error adding product');
        }
    });

    // Route to update product quantity detials
    app.post('/updateProd', async (req, res) => {
        try {
            const { productid, quantity } = req.body;
    
            // Call a function to insert this data into the product table
            const result = await updateProdQuant(pool, productid, quantity);
    
            res.status(201).json({ message: 'Product added successfully', result });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).send('Error adding product');
        }
    });

    // This is just to test
    app.get('/updateProdTest', async (req, res) => {
        try {
            // Extract productid and quantity from query parameters
            const { productid, quantity } = req.query;
    
            // Ensure productid and quantity are provided
            if (!productid || !quantity) {
                return res.status(400).json({ message: 'Product ID and quantity are required.' });
            }
    
            // Call a function to update the product quantity in the database
            const result = await updateProdQuant(pool, productid, quantity);
    
            res.status(200).json({ message: 'Product updated successfully', result });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).send('Error updating product');
        }
    });
    
    
    // Route to fetch supplier information as JSON
    app.get('/suppliers', async (req, res) => {
        try {
            const rows = await dispSupplier(pool); // Call to fetch supplier information with JOINs
            res.json(rows); // Send JSON response with key-value pairs for each row
        } catch (error) {
            console.error('Error fetching supplier data:', error);
            res.status(500).send('Error fetching supplier data');
        }
    });
    
    // Route to display supplier information in a table format
    app.get('/suppliers/table', async (req, res) => {
        try {
            const rows = await dispSupplier(pool); // Fetch supplier information with JOINs
            // Generate HTML table from rows
            const html = generateHtmlTable(rows, "Supplier Information");
            res.send(html); // Send the HTML response
        } catch (error) {
            console.error('Error fetching supplier data:', error);
            res.status(500).send('Error fetching supplier data');
        }
    });
    
    // Route to fetch purchase order information as JSON
    app.get('/purchaseOrders', async (req, res) => {
        try {
            const [rows] = await purchaseDisp(pool);
            res.json(rows); // Send JSON response with key-value pairs for each row
        } catch (error) {
            console.error('Error fetching purchase order data:', error);
            res.status(500).send('Error fetching purchase order data');
        }
    });
    
    // Route to display purchase order information in a table format
    app.get('/purchaseOrders/table', async (req, res) => {
        try {
            const [rows] = await purchaseDisp(pool);
    
            // Generate HTML table from rows
            const html = generateHtmlTable(rows, "Purchase Order Information")
            res.send(html); // Send the HTML response
        } catch (error) {
            console.error('Error fetching purchase order data:', error);
            res.status(500).send('Error fetching purchase order data');
        }
    });
    
    // Route to fetch supplier information as JSON
    app.get('/prodCat', async (req, res) => {
        try {
            const rows = await prodCatDisp(pool); // Call to fetch supplier information with JOINs
            res.json(rows); // Send JSON response with key-value pairs for each row
        } catch (error) {
            console.error('Error fetching product Category data:', error);
            res.status(500).send('Error fetching product Category data');
        }
    });
    
    // Route to display supplier information in a table format
    app.get('/prodCat/table', async (req, res) => {
        try {
            const rows = await prodCatDisp(pool); // Fetch supplier information with JOINs
            // Generate HTML table from rows
            const html = generateHtmlTable(rows, "Product Category Information");
            res.send(html); // Send the HTML response
        } catch (error) {
            console.error('Error fetching product Category data:', error);
            res.status(500).send('Error fetching product Category data');
        }
    });
    
    // Start the server
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})();




