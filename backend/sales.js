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
                    UPDATE product 
                    SET quantity = quantity + NEW.quantity 
                    WHERE productid = NEW.productid;
                END;
            `);
            console.log('Trigger created successfully for purchase updates.');
        } catch (err) {
            console.error('Error creating trigger for purchase updates:\n', err);
        }
    },
}
