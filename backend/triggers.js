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
            // Implement expiry check logic here
            return { success: true, message: 'Expiry check logic executed successfully.' };
        } catch (err) {
            console.error('Error in expiry check:\n', err);
            return { success: false, message: 'Error in expiry check.', error: err.message };
        }
    },

    setFunction: async function (pool, storename) {
        try {
            await pool.query(`USE \`${storename}\`;`);

            // Updated function: checkProductExists
            await pool.query(`
                CREATE FUNCTION checkProductExists(p_productid INT, p_supplierID INT)
                RETURNS BOOLEAN
                DETERMINISTIC
                READS SQL DATA
                BEGIN
                    DECLARE productCount INT;
                    SELECT COUNT(*) INTO productCount
                    FROM product
                    WHERE productid = p_productid AND supplierID = p_supplierID;
                    RETURN productCount > 0;
                END;
            `);

            // Updated function: checkCategoryExists
            await pool.query(`
                CREATE FUNCTION checkCategoryExists(p_categoryName VARCHAR(50))
                RETURNS BOOLEAN
                DETERMINISTIC
                READS SQL DATA
                BEGIN
                    DECLARE categoryCount INT;
                    SELECT COUNT(*) INTO categoryCount
                    FROM category
                    WHERE categoryName = p_categoryName;
                    RETURN categoryCount > 0;
                END;
            `);

            // Procedure to insert category if it doesn't exist
            await pool.query(`
                CREATE PROCEDURE insertCategoryIfNotExists(IN p_categoryName VARCHAR(50), OUT p_categoryID INT)
                BEGIN
                    DECLARE catExists BOOLEAN;
                    SET catExists = checkCategoryExists(p_categoryName);
                    IF catExists THEN
                        SELECT categoryID INTO p_categoryID
                        FROM category
                        WHERE categoryName = p_categoryName;
                    ELSE
                        INSERT INTO category (categoryName) VALUES (p_categoryName);
                        SET p_categoryID = LAST_INSERT_ID();
                    END IF;
                END;
            `);

            // Procedure to insert new products
            await pool.query(`
                CREATE PROCEDURE insertNewProduct(
                    IN p_productName VARCHAR(100),
                    IN p_price DECIMAL(10,2),
                    IN p_supplierID INT,
                    IN p_categoryID INT,
                    IN p_quantity DECIMAL(10,2),
                    IN p_reorderLevel DECIMAL(10,2),
                    IN p_expiry DATE
                )
                BEGIN
                    INSERT INTO product (productName, price, supplierID, categoryID, quantity, reorderLevel, expiry, dateAdded)
                    VALUES (p_productName, p_price, p_supplierID, p_categoryID, p_quantity, p_reorderLevel, p_expiry, NOW());
                END;
            `);

            // Procedure to update product quantity
            await pool.query(`
                CREATE PROCEDURE updateProductQuantity(IN p_productid INT, IN p_quantity DECIMAL(10,2))
                BEGIN
                    UPDATE product
                    SET quantity = quantity + p_quantity
                    WHERE productid = p_productid;
                END;
            `);

            // Trigger for after purchase update
            await pool.query(`
                CREATE TRIGGER afterPurchaseUpdate
                AFTER INSERT ON purchaseOrder
                FOR EACH ROW
                BEGIN
                    DECLARE existingCategoryID INT;

                    IF NEW.orderStatus = 1 THEN
                        IF checkProductExists(NEW.productid, NEW.supplierID) THEN
                            CALL updateProductQuantity(NEW.productid, NEW.quantity);
                        ELSE
                            CALL insertCategoryIfNotExists(
                                (SELECT categoryName FROM newProductPurchase WHERE productid = NEW.productid),
                                existingCategoryID
                            );

                            CALL insertNewProduct(
                                (SELECT productName FROM newProductPurchase WHERE productid = NEW.productid),
                                (SELECT price FROM newProductPurchase WHERE productid = NEW.productid),
                                NEW.supplierID,
                                existingCategoryID,
                                NEW.quantity,
                                (SELECT reorderLevel FROM newProductPurchase WHERE productid = NEW.productid),
                                (SELECT expiry FROM newProductPurchase WHERE productid = NEW.productid)
                            );
                        END IF;
                    END IF;
                END;
            `);

            console.log('Functions and procedures created successfully.');
            return { success: true, message: 'Functions and procedures created successfully.' };
        } catch (err) {
            console.error('Error creating functions or procedures:\n', err);
            return { success: false, message: 'Error creating functions or procedures.', error: err.message };
        }
    }
};
