/*
This method is to be called at the start of creation of this database. It is a trigger and once called, the 
database stores this and need not be called again.

productSaleUpdate: a trigger to update the product quantity upon sales
afterPurchaseUpdate: a trigger to update the product quantity upon purchase from supplier
*/

module.exports = {
    productSaleUpdate: async function (pool) {
        try {
            await pool.query(`DROP TRIGGER IF EXISTS updateProductOnSale;`);
            await pool.query(`
                CREATE TRIGGER updateProductOnSale
                AFTER INSERT ON sales
                FOR EACH ROW
                BEGIN
                    UPDATE product
                    SET quantity = quantity - NEW.quantitySold
                    WHERE productid = NEW.productid;
                END;
            `);
            console.log('Trigger created successfully for sales updates.');
            return { success: true, message: 'Trigger for sales updates created successfully.' };
        } catch (err) {
            console.error('Error creating trigger for sales updates:\n', err);
            return { success: false, message: 'Error creating trigger for sales updates.', error: err.message };
        }
    },

    afterPurchaseUpdate: async function (pool) {
        try {
            await pool.query(`DROP TRIGGER IF EXISTS afterPurchaseUpdate;`);
            await pool.query(`
                CREATE TRIGGER afterPurchaseUpdate
                AFTER UPDATE ON purchaseOrder
                FOR EACH ROW
                BEGIN
                    IF NEW.orderStatus = 1 AND NEW.isNew = 0 THEN
                        UPDATE product
                        SET quantity = quantity + NEW.quantity
                        WHERE productid = NEW.productid;
                    END IF;
                END;
            `);
            console.log('Trigger created successfully for purchase updates.');
            return { success: true, message: 'Trigger for purchase updates created successfully.' };
        } catch (err) {
            console.error('Error creating trigger for purchase updates:\n', err);
            return { success: false, message: 'Error creating trigger for purchase updates.', error: err.message };
        }
    },

    expiryCheck: async function (pool, storename) {
        try {
            // Ensure the stored procedure does not already exist before creating it
            await pool.query(`DROP PROCEDURE IF EXISTS CheckExpiredProducts;`);
    
            await pool.query(`
                CREATE PROCEDURE CheckExpiredProducts(IN storeName VARCHAR(255))
                BEGIN
                    DECLARE currentDate DATE;
    
                    -- Get the current date
                    SET currentDate = CURDATE();
    
                    -- Insert expired products into alerts table
                    INSERT INTO alerts (productID, productName, expiryDate)
                    SELECT p.productID, p.productName, p.expiry
                    FROM products p
                    WHERE p.expiry < currentDate
                      AND NOT EXISTS (
                          SELECT 1 FROM alerts a WHERE a.productID = p.productID
                      ); -- Avoid inserting duplicates in alerts
                END;
            `);
    
            // Optionally, call the procedure to execute it immediately after creation
            // await pool.query("CALL CheckExpiredProducts(?);", [storename]);
    
            return { success: true, message: 'Expiry check logic executed successfully.' };
        } catch (err) {
            console.error('Error in expiry check:\n', err);
            return { success: false, message: 'Error in expiry check.', error: err.message };
        }
    }
};
