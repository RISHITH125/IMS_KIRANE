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
    productCreate: async function(pool, productName, price, supplierID, categoryID, quantity, reorderLevel, expiryDate) {
        // dateAdded is the day that the user adds the product.
        try {
            const dateAdded = new Date().toISOString().split('T')[0];
            await pool.query(
                `INSERT INTO product (productName, price, supplierID, categoryID, quantity, reorderLevel, expiry, dateadded) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                [productName, price, supplierID, categoryID, quantity, reorderLevel, expiryDate, dateAdded]
            );
        } catch (err) {
            console.error("Couldn't insert details of the product...", err);
        }
    },

    updateProdQuant: async function (pool, productid, newQuantity) {
        try {
            await pool.query(`
                UPDATE product 
                SET quantity = ?
                WHERE productid = ?;
            `, [newQuantity, productid])
        } catch(err) {
            console.error("Couldn't update the product quantity anonymously")
        }
    },

    categoryAdd: async function(pool, description, categoryName) {
        try {
            await pool.query(`
                INSERT IGNORE INTO category(description, categoryName) 
                VALUES (?, ?)`, [description, categoryName]);
        } catch (err) {
            console.error("Couldn't insert details of the category...", err);
        }
    },

    supplierAdd: async function(pool, address, supplierName, phnoArray, emailArray) {
        try {
            // Insert into supplier table
            await pool.query(`
                INSERT IGNORE INTO supplier (
                address, supplierName) 
                VALUES (?, ?)`, [address, supplierName]);
    
            // Insert phone numbers into supplier_phno table
            for (const phno of phnoArray) {
                await pool.query(`
                    INSERT IGNORE INTO supplier_phno (
                    supplierID, phno) 
                    VALUES (?, ?)`, [supplierID, phno]);
            }
    
            // Insert emails into supplier_email table
            for (const email of emailArray) {
                await pool.query(`
                    INSERT IGNORE INTO supplier_email (
                    supplierID, email) 
                    VALUES (?, ?)`, [supplierID, email]);
            }
    
        } catch (err) {
            console.error("Couldn't insert details of the supplier...", err);
        }
    }
}