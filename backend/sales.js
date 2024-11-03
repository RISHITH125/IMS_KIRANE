/*
This method is to be called at the start of creation of this database. It is a trigger and once called, the 
database stores this and need not be called again.
*/

module.exports = {
    productSaleUpdate: async function(pool) {
        try {
            await pool.query(`
                CREATE TRIGGER updateProductOnSale
                AFTER INSERT
                ON sales
                FOR EACH ROW
                BEGIN
                    UPDATE product
                    SET product.quantity = product.quantity - NEW.quantitySold 
                    WHERE product.productid = NEW.productid;
                END;
            `);
            console.log('Trigger created successfully.');
        } catch(err) {
            console.error('Error updating the product table upon insert in sales table!\n', err)
        }
    }
}