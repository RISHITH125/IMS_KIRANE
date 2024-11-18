/*
you have to collect product information, supplier information and category information
product is:
    productID: given by user,
    productName,
    price,
    supplierID,
    categoryID,
    quantity,
    reorderLevel,
    expiry,
    dateadded

supplier information is:
    supplierID: given by user,
    address,
    supplierName,
    supplier_phno,
    email

category information is:
    categoryID: given by user,
    description,
    categoryName
*/
module.exports = {
  productCreate: async function (
    storeName,
    pool,
    productName,
    price,
    supplierID,
    categoryID,
    quantity,
    reorderLevel,
    expiryDate
) {
    try {
        await pool.query(`USE \`${storeName}\`;`);
        const dateAdded = new Date().toISOString().split("T")[0];
        
        // Perform the insert operation
        await pool.query(
            `INSERT INTO product (productName, price, supplierID, categoryID, quantity, reorderLevel, expiry, dateadded) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                productName,
                price,
                supplierID,
                categoryID,
                quantity,
                reorderLevel,
                expiryDate,
                dateAdded,
            ]
        );

        // Get the last inserted product ID
        const [result] = await pool.query(`SELECT LAST_INSERT_ID() AS productid;`);
        const productId = result[0].productid;

        return { success: true, message: "Product inserted successfully.", productId };
    } catch (err) {
        console.error("Couldn't insert details of the product...", err);
        return { success: false, message: "Error inserting product.", error: err.message };
    }
},

  updateProdQuant: async function (pool, productid, newQuantity, storeName) {
    try {
      await pool.query(`USE \`${storeName}\`;`);
      await pool.query(
        `
                UPDATE product 
                SET quantity = ?
                WHERE productid = ?;
            `,
        [newQuantity, productid]
      );
    } catch (err) {
      console.error("Couldn't update the product quantity anonymously");
    }
  },

  categoryAdd: async function (pool, description, categoryName, storeName) {
    try {
      await pool.query(`USE \`${storeName}\`;`);
      await pool.query(
        `
                INSERT IGNORE INTO category(description, categoryName) 
                VALUES (?, ?)`,
        [description, categoryName]
      );
    } catch (err) {
      console.error("Couldn't insert details of the category...", err);
    }
  },

  supplierAdd: async function (
    pool,
    storeName,
    address,
    supplierName,
    phno,
    email
  ) {
    try {
      await pool.query(`USE \`${storeName}\`;`);
      const result = await pool.query(
        `
                INSERT INTO supplier (address, supplierName) 
                VALUES (?, ?)`,
        [address, supplierName]
      );

      const supplierID = result[0].insertId; // Get the newly inserted supplier ID
      console.log("Supplier ID: ", supplierID);
      // Insert phone numbers into supplier_phno table
      await pool.query(
        `
                    INSERT INTO supplier_phno (supplierID, phno) 
                    VALUES (?, ?)`,
        [supplierID, phno]
      );
      // Insert emails into supplier_email table
      await pool.query(
        `
                    INSERT INTO supplier_email (supplierID, email) 
                    VALUES (?, ?)`,
        [supplierID, email]
      );
      return { success: true, message: "Added new supplier details" };
    } catch (err) {
      console.error("Couldn't insert details of the supplier...", err);
      return {
        success: false,
        message: "Couldn't add new supplier details due to database error",
      };
    }
  },
};
