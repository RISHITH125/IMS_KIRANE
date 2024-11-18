const express = require("express");
require("dotenv").config();
// const mysql = require('mysql2');
const mysql = require("mysql2/promise");
const cors = require("cors");

const { createStoreDatabase, loginPage, signUpPage, googleAuth, checkStore, loginCreate, AuthPage } = require("./login.js");
const { dispSupplier } = require("./supplierDisp.js");
const { purchaseDisp } = require("./purchaseDisp.js");
const { prodCatDisp } = require("./prodCatDisp.js");
const { productCreate, categoryAdd, updateProdQuant, supplierAdd, } = require("./product.js");
const { categoryNametoID, supplierNametoID, productNametoID } = require("./NameBaseId.js");
const { OAuth2Client } = require("google-auth-library");
const { addPurchase } = require("./addPurchaseOrder.js");
const { newProdAdd } = require("./newProdPurchase.js");
const { salesDisp } = require("./salesDisp.js");
const { addSales } = require("./addSales.js");
const { productSaleUpdate, afterPurchaseUpdate } = require("./triggers.js")

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

        if (!result.success) {
            return res.status(404).json({ message: result.message, data:result.err }); // Send response if login fails
        }

        // Check that data is not empty
        const userDet = result.data; // Destructure storename and username
        console.log(userDet.storename, userDet.username); // Log both values to confirm

        const storeResult = await checkStore(genpool, userDet.storename);
        if (!storeResult.success) {
            return res.status(404).json({ message: false, data: storeResult.message }); // Send response if store check fails
        }
        console.log("storeResult: ", storeResult)

        // Create a new database connection pool for the user's store
        genpool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: userDet.storename, // Use the new database
        });

        // Respond to the client with a success message and relevant data
        res.status(200).json({ message: true, data: userDet });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({message: true, data: "Error logging in"}); // Send a response in case of an error
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
  app.post("/addStore", async (req, res) => {
    try {
        const { username, email, password, fullname, phno, storename } = req.body;
        
        // Update user with store name
        await genpool.query(`UPDATE user SET storename = ? WHERE email = ?`, [storename, email]);
        console.log(username, email, password, fullname, phno, storename);
        
        // Create store database
        genpool = await createStoreDatabase(genpool, storename, username);
        
        // Create login and other necessary records
        const result = await loginCreate(genpool, fullname, password, storename, username, email, phno);

        // Call the triggers and functions and procedures
        const productSaleResult = await productSaleUpdate(genpool, storename);
        if (!productSaleResult.success) {
            return res.status(500).json({ success: false, message: productSaleResult.message });
        }

        const afterPurUp = await afterPurchaseUpdate(genpool, storename)
        if (!afterPurUp.success) {
          return res.status(500).json({ success: false, message: afterPurUp})
        }
        // Check the result of the login creation
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (err) {
        console.error("Error in receiving the details from the signup or google auth page or database is inaccessible:\n", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

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
      const result = await googleAuth(
        genpool,
        payload.name,
        payload.email,
        sub_claim
      );
      const ressend = await AuthPage(genpool, payload.email, sub_claim);

      if (result.success && ressend.success) {
        res.status(200).json({
          message: result.message,
          data: payload,
          userdet: ressend.data,
        });
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
          message: [],
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

      const categoryID = await categoryNametoID(genpool, categoryName);
      const supplierID = await supplierNametoID(genpool, supplierName);

      // Call a function to insert this data into the product table
      const result = await productCreate(
        genpool,
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

  // Route to update product quantity detials
  app.post("/:storename/updateProd", async (req, res) => {
    try {
      const { productid, quantity } = req.body;

      // Call a function to insert this data into the product table
      const result = await updateProdQuant(genpool, productid, quantity);

      res.status(201).json({ message: "Product added successfully", result });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Error adding product");
    }
  });

  // Route to fetch supplier information as JSON
  app.get("/:storename/suppliers", async (req, res) => {
    const { storename } = req.params;
    try {
      const rows = await dispSupplier(genpool, storename); // Call to fetch supplier information with JOINs
      console.log("Rows:", rows); // Log the rows to check if data is fetched
      res.json({ success: true, data: rows }); // Send JSON response with key-value pairs for each row
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      res
        .status(500)
        .json({ success: false, data: "Error fetching supplier data" });
    }
  });

  // Route to fetch purchase order information as JSON
  app.get("/:storename/purchaseOrders", async (req, res) => {
    const { storename } = req.params;
    try {
        const rows = await purchaseDisp(genpool, storename); // No need to destructure here
        res.status(200).json({ success: true, data: rows }); // Send JSON response with key-value pairs for each row
    } catch (error) {
        console.error("Error fetching purchase order data:", error);
        res.status(500).json({ success: false, data: "Error fetching purchase order data" });
    }
});

app.post("/:storename/addPurchase", async (req, res) => {
  const { storename } = req.params;
  try {
      const rows = req.body.data;
      let result;
      let successCount = 0; // To count successful operations
      console.log("Received rows:", JSON.stringify(rows, null, 2)); // Log the entire rows for debugging

      for (const jsonContent of rows) {
          const {
              purchaseOrderid,
              deliveryDate,
              orderDate,
              quantity,
              supplierID,
              supplierName,
              productid,
              productName,
              price,
              categoryName,
              reorderLevel,
              expiry,
              isNewProduct,
              orderStatus,
          } = jsonContent;

          console.log("Processing item:", JSON.stringify(jsonContent, null, 2)); // Log individual item

          // Check the expiry value before proceeding
          console.log("Expiry value:", expiry);

          if (!isNewProduct) {
              const supplierid = await supplierNametoID(genpool, supplierName, storename);
              const productID = await productNametoID(genpool, productName, storename);
              result = await addPurchase(
                  genpool,
                  storename,
                  orderStatus,
                  deliveryDate,
                  orderDate,
                  quantity,
                  isNewProduct,
                  supplierid,
                  productID
              );
          } else {
              // Validate expiry before passing it
              if (!expiry || expiry.trim() === "") {
                  console.error("Invalid expiry date for new product:", expiry);
                  return res.status(400).json({
                      success: false,
                      message: "Invalid expiry date provided for new product.",
                  });
              }

              console.log("Adding new product with expiry:", expiry); // Debug log for expiry
              const newResult = await newProdAdd(
                  genpool,
                  storename,
                  productName,
                  price,
                  categoryName,
                  reorderLevel,
                  expiry,
                  orderDate,
                  quantity,
                  supplierID,
                  supplierName,
                  purchaseOrderid,
              );

              if (!newResult.success) {
                  console.log("Error adding new product purchase to newProductPurchase table");
                  return res.status(404).json({
                      success: false,
                      message: "Couldn't add new purchase details due to database error",
                  });
              }
          }

          if (result && result.success) {
              successCount += 1; // Increment success count
          }
      }

      // Return success response
      res.status(200).json({
          success: true,
          message: `${successCount} purchases processed successfully.`,
      });

  } catch (err) {
      console.error("Error in add Purchase route:", err); // Log the error for debugging
      res.status(500).json({
          success: false,
          message: "Couldn't add new purchase details due to database error",
      });
  }
});

  app.post("/:storename/addSupplier", async (req, res) => {
    const { storename } = req.params;

    try {
      // Expecting suppliers to be in the 'newSuppliers' field of the request body
      const suppliers = req.body.newSuppliers;

      // Check if suppliers is an array
      if (!Array.isArray(suppliers)) {
        return res.status(400).json({ success: false, message: "Suppliers should be an array" });
      }

      // Create an array of promises to add each supplier
      const promises = suppliers.map(async (supplier) => {
        const { supplierName, address, phoneNumber, email } = supplier;
        console.log(supplierName, address, phoneNumber, email);

        // Assuming supplierAdd is a function that handles the database insertion
        const result = await supplierAdd(
          genpool,
          storename,
          address,
          supplierName,
          phoneNumber,
          email
        );

        return result;
      });

      // Wait for all the suppliers to be processed
      const results = await Promise.all(promises);

      // Check if all suppliers were added successfully
      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        return res
          .status(200)
          .json({ success: true, message: "Suppliers added successfully." });
      } else {
        return res.status(400).json({
          success: false,
          message: "Some suppliers couldn't be added.",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Couldn't add new supplier details due to a database error.",
      });
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

  //handle new products and updated items
  app.post("/:storename/newupdateprods", async (req, res) => {
    try {
        const { updatedItems, newProducts, storename } = req.body;

        if (!updatedItems && !newProducts) {
            return res.status(400).json({ message: "No data provided" });
        }

        const updateResults = [];
        const newProductResults = [];

        // Handle updatedItems
        if (updatedItems && updatedItems.length > 0) {
            for (const item of updatedItems) {
                const { productid, quantity } = item;

                if (!productid || quantity == null) {
                    return res.status(400).json({
                        message: "Missing productid or quantity in updatedItems",
                    });
                }

                const updateResult = await updateProdQuant(
                    genpool,
                    productid,
                    quantity,
                    storename
                );
                updateResults.push({ productid, quantity, updateResult });
            }
        }

        // Handle newProducts
        if (newProducts && newProducts.length > 0) {
            for (const product of newProducts) {
                const {
                    productName,
                    price,
                    supplierName,
                    categoryName,
                    quantity,
                    reorderLevel,
                    expiry,
                } = product;

                if (
                    !productName ||
                    price == null ||
                    !supplierName ||
                    !categoryName ||
                    quantity == null ||
                    reorderLevel == null ||
                    !expiry
                ) {
                    return res.status(400).json({
                        message: "Missing required fields in newProducts",
                    });
                }

                let categoryID = await categoryNametoID(
                    genpool,
                    categoryName,
                    storename
                );
                const supplierID = await supplierNametoID(
                    genpool,
                    supplierName,
                    storename
                );

                if (categoryID === null) {
                    await categoryAdd(genpool, null, categoryName, storename);
                    categoryID = await categoryNametoID(
                        genpool,
                        categoryName,
                        storename
                    );
                }

                if (supplierID === null) {
                    return res.status(404).send("Supplier not found");
                }

                const newProductResult = await productCreate(
                    storename,
                    genpool,
                    productName,
                    price,
                    supplierID,
                    categoryID,
                    quantity,
                    reorderLevel,
                    new Date(expiry) // Ensure expiry is a Date object
                );

                newProductResults.push({
                    productName,
                    price,
                    supplierName,
                    categoryName,
                    quantity,
                    reorderLevel,
                    expiry,
                    newProductResult,
                });
            }
        }

        // Respond with results
        res.status(201).json({
            result: true,
            message: "Products updated and/or added successfully",
            updatedItems: updateResults,
            newProducts: newProductResults,
        });
    } catch (error) {
        console.error("Error processing /newupdateprods:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

  app.get("/:storename/sales", async (req, res) => {
    const { storename } = req.params;

    const result = await salesDisp(genpool, storename);
    console.log(result)
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  });

  app.post("/:storename/addsales", async (req, res) => {
    const { storename } = req.params;
    const { productName, quantitySold, salesPrice, paymentMethod } = req.body;

    const result = await addSales(
      genpool,
      productName,
      quantitySold,
      salesPrice,
      paymentMethod,
      storename
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  });

  app.post("/:storename/orderReceived", async (req, res) => {
    const storename = req.params;
    try {
        const { purchaseOrderid, isNew } = req.body;
        await genpool.query(`USE \`${storename}\`;`);
        if(!isNew){
          await genpool.query(`
              UPDATE purchaseOrder
              SET orderStatus = 1
              WHERE purchaseOrderid = ?;
          `, [purchaseOrderid]);
        } else {
          const [newProductDetails] = await genpool.query(`
            SELECT productName, price, categoryName, reorderLevel, expiry, orderDate, quantity, supplierID, supplierName
            FROM newProductPurchase
            WHERE purchaseOrderid = ?;
        `, [purchaseOrderid]);

          if (newProductDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No new product details found for the given purchaseOrderid."
            });
          }

          const { productName, price, categoryName, reorderLevel, expiry, quantity, supplierID, supplierName } = newProductDetails[0]
          
          // you need to insert into product table
          // you need to fetch productid and supplierid, 
          // you need to insert this into purchaseOrder table.
          const categoryID = categoryNametoID(storename, categoryName)
          const result = await productCreate(storename, genpool, productName, price, supplierID, categoryID, quantity, reorderLevel, expiry)
          if (result.success) {
            const addpurRes = await addPurchase(genpool, storename, 1, deliveryDate, orderDate, quantity, isNew, supplierID, productid)
            if(!addpurRes.success) {
              res.send(500).json(addpurRes)
            }
          }

        // Return success response
        res.status(200).json({
            success: true,
            message: "Order status updated successfully."
        });}
    } catch (err) {
        // Return error response
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the order status.",
            error: err.message // Optionally include the error message for debugging
        });
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
