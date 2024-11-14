/*
This method is to be called at the start of creation of this database. It is a trigger and once called, the 
database stores this and need not be called again.

productSaleUpdate: a trigger to update the product quantity upon sales
afterPurchaseUpdate: a trigger to update the product quantity upon purchase from supplier
*/

module.exports = {
    productSaleUpdate: async function(pool) {
        try {
            // Drop the trigger if it already exists
            await pool.query(`DROP TRIGGER IF EXISTS updateProductOnSale;`);
            
            // Create the trigger
            await pool.query(`
                CREATE TRIGGER updateProductOnSale
                AFTER INSERT
                ON sales
                FOR EACH ROW
                BEGIN
                    UPDATE product
                    SET quantity = quantity - NEW.quantitySold 
                    WHERE productid = NEW.productid;
                END;
            `);
            console.log('Trigger created successfully for sales updates.');
        } catch (err) {
            console.error('Error creating trigger for sales updates:\n', err);
        }
    },

    afterPurchaseUpdate: async function(pool) {
        try {
            // Drop the trigger if it already exists
            await pool.query(`DROP TRIGGER IF EXISTS afterPurchaseUpdate;`);

            // Create the trigger
            await pool.query(`
                CREATE TRIGGER afterPurchaseUpdate
                AFTER INSERT
                ON purchaseOrder
                FOR EACH ROW
                BEGIN
                    -- Check if the new order status is 1 (indicating the order has been received)
                    IF NEW.orderStatus = 1 THEN
                        UPDATE product 
                        SET quantity = quantity + NEW.quantity 
                        WHERE productid = NEW.productid;
                    END IF;
                END;
            `);
            console.log('Trigger created successfully for purchase updates.');
        } catch (err) {
            console.error('Error creating trigger for purchase updates:\n', err);
        }
    },

    expiryCheck: async function (pool, storename) {
        try {

        } catch(err) {
            
        }
    },

    setFunction: async function(pool, storename) {
        try {
            await pool.query(`USE \`${storename}\`;`);
            await pool.query(`
                CREATE FUNCTION checkProductExists(p_productid INT, p_supplierID INT)
                RETURNS BOOLEAN
                BEGIN
                    DECLARE productCount INT;

                    SELECT COUNT(*) INTO productCount
                    FROM product
                    WHERE productid = p_productid AND supplierID = p_supplierID;

                    RETURN productCount > 0;
                END
            `)

            await pool.query(`
                CREATE FUNCTION checkCategoryExists(p_categoryName VARCHAR(50))
                RETURNS BOOLEAN
                BEGIN
                    DECLARE categoryCount INT;

                    SELECT COUNT(*) INTO categoryCount
                    FROM category
                    WHERE categoryName = p_categoryName;

                    RETURN categoryCount > 0;
                END
            `)

            await pool.query(`
                CREATE PROCEDURE insertCategoryIfNotExists(IN p_categoryName VARCHAR(50), OUT p_categoryID INT)
                BEGIN
                    DECLARE catExists BOOLEAN;

                    SET catExists = checkCategoryExists(p_categoryName);

                    IF catExists THEN
                        -- Get the existing categoryID
                        SELECT categoryID INTO p_categoryID
                        FROM category
                        WHERE categoryName = p_categoryName;
                    ELSE
                        -- Insert the new category
                        INSERT INTO category (categoryName) VALUES (p_categoryName);
                        SET p_categoryID = LAST_INSERT_ID();
                    END IF;
                END
            `)

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
                END
            `)

            await pool.query(`
                CREATE PROCEDURE updateProductQuantity(IN p_productid INT, IN p_quantity DECIMAL(10,2))
                BEGIN
                    UPDATE product
                    SET quantity = quantity + p_quantity
                    WHERE productid = p_productid;
                END
            `)

            await pool.query(`
                CREATE TRIGGER afterPurchaseUpdate
                AFTER INSERT ON purchaseOrder
                FOR EACH ROW
                BEGIN
                    DECLARE existingCategoryID INT;

                    -- Check if the orderStatus is 1, indicating the order has been received
                    IF NEW.orderStatus = 1 THEN

                        -- Check if the product already exists in the product table
                        IF checkProductExists(NEW.productid, NEW.supplierID) THEN
                            -- Update the quantity if the product exists
                            CALL updateProductQuantity(NEW.productid, NEW.quantity);

                        ELSE
                            -- Insert new category if it doesn't exist and get the category ID
                            CALL insertCategoryIfNotExists(
                                (SELECT categoryName FROM newProductPurchase WHERE productid = NEW.productid),
                                existingCategoryID
                            );

                            -- Insert the new product using the retrieved category ID
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

                END
            `)
        } catch (err) {

        }
    }
}
