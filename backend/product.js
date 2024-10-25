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
    productCreate: async function(pool, productID, productName, price, expiryDate, supplierId, categoryId, quantity, reorderLevel) {
        // dateAdded is the day that the user adds the product.
        try {
            const dateAdded = new Date().toISOString().split('T')[0];
            
            await pool.query(`INSERT INTO product(productID, productName, price, supplierId, categoryId, quantity, reorderLevel, expiry, dateAdded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [productID, productName, price, supplierId, categoryId, quantity, reorderLevel, expiryDate, dateAdded]);        
                
        } catch (err) {
            console.error("Couldn't insert details of the produt...", err);
        }
    },

    categoryAdd: async function(pool, categoryID, description, categoryName) {
        try {
            await pool.query(`
                INSERT IGNORE INTO category(categoryID, description, categoryName) 
                VALUES (?, ?, ?)`, [categoryID, description, categoryName]);
        } catch (err) {
            console.error("Couldn't insert details of the category...", err);
        }
    },

    supplierAdd: async function(pool, supplierID, address, supplierName, phnoArray, emailArray) {
        try {
            // Insert into supplier table
            await pool.query(`
                INSERT IGNORE INTO supplier (
                supplierID, address, supplierName) 
                VALUES (?, ?, ?)`, [supplierID, address, supplierName]);
    
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