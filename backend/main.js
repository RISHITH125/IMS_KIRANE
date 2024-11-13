const express = require("express");
require("dotenv").config();
// const mysql = require('mysql2');
const mysql = require("mysql2/promise");
const cors = require("cors");

const { createStoreDatabase, loginPage, signUpPage, googleAuth, checkStore, loginCreate, AuthPage } = require("./login.js");
const { dispSupplier } = require("./supplierDisp.js");
const { purchaseDisp } = require("./purchaseDisp.js");
const { prodCatDisp } = require("./prodCatDisp.js");
const { productCreate, categoryAdd, updateProdQuant } = require("./product.js");
const { categoryNametoID, supplierNametoID } = require("./NameBaseId.js");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Store your Google Client ID in .env

const client = new OAuth2Client(CLIENT_ID);

const app = express();
const port = 3000;

// Set up the MySQL connection pool
let genpool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  // app.use(cors({ origin: 'http://localhost:5173' }));
  // Middleware to parse JSON bodies
  app.use(express.json());
  app.use(cors());

  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body; // Using email and password fields

      // Call a login function to authenticate the user
      const result = await loginPage(genpool, email, password);
      console.log("Result:", result); // Log the result to check
      if (result.success) {
        // Check that data is not empty
        const userDet = result.data; // Destructure storename and name from the first object in the array
        console.log(userDet.storename, userDet.username); // Log both values to confirm

        const storeResult = await checkStore(genpool, userDet.storename);
        // console.log(storeResult);

        // // This is done to check if the user proceeded 
        if (storeResult.success) {
        //   genpool = await createStoreDatabase(genpool, storename, username);
        //   console.log("message: ", result.message);
        // } else { // This is done to check 
          genpool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: userDet.storename, // Now use the new database
          });
        } else {
          res.status(404).json({message: false, data: storeResult.message})
        }
        // const [rows] = await genpool.query(`
        //   select * from product;`)
        // console.log(rows)
        // Respond to the client with a success message and relevant data
        res.status(200).json({ message: true, data: userDet });
      } else {
        res.status(404).json({ message: result.data });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Error logging in");
    }
  });

  app.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log(req.body);
      const result = await signUpPage(genpool, username, email, password);
      if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(404).json({ message: result.message });
      }
    } catch (err) {
      console.error("Error occcured while signup checking...", err);
      res.status(500).send("Error checking signup credentials");
    }
  });

  // this endpoint is only for signup and auth endpoints
  app.post('/addStore', async (req, res) => {
    try {
      // just check if password is hashed or not
      const { username, email, password, fullname, phno, storename } = req.body
      await genpool.query(`
        UPDATE user SET storename = ? WHERE email = ?`, [storename, email])
      console.log(username, email, password, fullname, phno, storename)
      genpool = await createStoreDatabase(genpool, storename, username)
      const result = await loginCreate(genpool, fullname, password, storename, username, email, phno)
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (err) {
      console.error('Error in receiving the details from the signup or google auth page or database is inaccessible..\n', err)
    }
  })


//   ALTER TABLE user MODIFY storename VARCHAR(100) NULL;
// dont forget to use this


app.post("/auth", async (req, res) => {
    try {
        const { token } = req.body; // JWT token from frontend

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, // Specify the client ID to verify the token
        });

        const payload = ticket.getPayload();
        console.log("User info:", payload);

        // Retrieve the 'sub' claim (Google user ID)
        const sub_claim = payload.sub;

        // Handle user authentication or creation in the database
        const result = await googleAuth(genpool, payload.name, payload.email, sub_claim);
        const ressend = await AuthPage(genpool, payload.email, sub_claim);

        if (result.success && ressend.success) {
            res.status(200).json({ message: result.message, data: payload , userdet: ressend.data});
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error during Google Authentication:", error);
        res.status(500).json({ message: "Error during Google Authentication" });
    }
});

  // Route to fetch all product data
  app.get("/:storename/products", async (req, res) => {
    const { storename } = req.params;
    console.log("Store name:", storename); // Log the storename from the request
  
    try {
      // Fetch products for the given storename
      const rows = await prodCatDisp(genpool, storename); // Use the correct function call
      console.log("Rows:", rows); // Log the rows to check if data is fetched
      if (rows && rows.length > 0) {
        res.json({
          result: true,
          message: rows, // Return the rows directly as JSON
        });
      } else {
        res.json({
          result: true,
          message: "No products found for this store",
        });
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      res.status(500).json({
        result: false,
        message: "Error fetching product data",
      });
    }
  });
  
  // Route to add Product details into table
  app.post("/:storename/addProduct", async (req, res) => {
    try {
      const {
        productName,
        price,
        supplierName,
        categoryName,
        quantity,
        reorderLevel,
        expiry,
      } = req.body;

      const categoryID = await categoryNametoID(pool, categoryName);
      const supplierID = await supplierNametoID(pool, supplierName);

      // Call a function to insert this data into the product table
      const result = await productCreate(
        pool,
        productID,
        productName,
        price,
        supplierID,
        categoryID,
        quantity,
        reorderLevel,
        expiry,
        dateadded
      );

      res.status(201).json({ message: "Product added successfully", result });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("Error adding product");
    }
  });

  // This is just for testing purposes
  app.get("/:storename/addProductTest", async (req, res) => {
    try {
      // Extract values from the query parameters
      const {
        productName,
        price,
        supplierName, // needs to be discussed: do you need to add address, phone number, email of the supplier?
        categoryName,
        quantity,
        reorderLevel,
        expiry,
      } = req.query;

      // Check if all required fields are provided
      if (
        !productName ||
        !price ||
        !supplierName ||
        !categoryName ||
        !quantity ||
        !reorderLevel ||
        !expiry
      ) {
        return res.status(400).send("Missing required query parameters");
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
        await categoryAdd(pool, null, categoryName);
      }
      if (supplierID === null) {
        return res.status(404).send("Supplier not found");
      }

      // Call a function to insert this data into the product table
      const result = await productCreate(
        pool,
        productName,
        parsedPrice,
        supplierID,
        categoryID,
        parsedQuantity,
        parsedReorderLevel,
        parsedExpiry
      );

      res.status(201).json({ message: "Product added successfully", result });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("Error adding product");
    }
  });

  // Route to update product quantity detials
  app.post("/:storename/updateProd", async (req, res) => {
    try {
      const { productid, quantity } = req.body;

      // Call a function to insert this data into the product table
      const result = await updateProdQuant(pool, productid, quantity);

      res.status(201).json({ message: "Product added successfully", result });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Error adding product");
    }
  });

  // This is just to test
  app.get("/:storename/updateProdTest", async (req, res) => {
    try {
      // Extract productid and quantity from query parameters
      const { productid, quantity } = req.query;

      // Ensure productid and quantity are provided
      if (!productid || !quantity) {
        return res
          .status(400)
          .json({ message: "Product ID and quantity are required." });
      }

      // Call a function to update the product quantity in the database
      const result = await updateProdQuant(pool, productid, quantity);

      res.status(200).json({ message: "Product updated successfully", result });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Error updating product");
    }
  });

  // Route to fetch supplier information as JSON
  app.get("/:storename/suppliers", async (req, res) => {
    try {
      const rows = await dispSupplier(pool); // Call to fetch supplier information with JOINs
      res.json(rows); // Send JSON response with key-value pairs for each row
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      res.status(500).send("Error fetching supplier data");
    }
  });

  // Route to fetch purchase order information as JSON
  app.get("/:storename/purchaseOrders", async (req, res) => {
    try {
      const [rows] = await purchaseDisp(pool);
      res.json(rows); // Send JSON response with key-value pairs for each row
    } catch (error) {
      console.error("Error fetching purchase order data:", error);
      res.status(500).send("Error fetching purchase order data");
    }
  });

  // Route to fetch supplier information as JSON
  app.get("/:storename/prodCat", async (req, res) => {
    try {
      const rows = await prodCatDisp(pool); // Call to fetch supplier information with JOINs
      res.json(rows); // Send JSON response with key-value pairs for each row
    } catch (error) {
      console.error("Error fetching product Category data:", error);
      res.status(500).send("Error fetching product Category data");
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
