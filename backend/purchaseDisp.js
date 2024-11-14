// This is to display in express the purchase Order details

module.exports = {
  purchaseDisp: async function (pool, storeName) {
    try {
      console.log(storeName);
      await pool.query(`USE \`${storeName}\`;`);
      const [rows] = await pool.query(`
               SELECT 
    po.purchaseOrderid, 
    po.orderStatus, 
    po.deliveryDate, 
    po.orderDate, 
    po.quantity, 
    po.supplierID,
    s.supplierName, 
    p.productName
FROM 
    purchaseOrder po
JOIN 
    supplier s ON po.supplierID = s.supplierID
JOIN 
    product p ON po.productid = p.productid
ORDER BY 
   s.supplierName;
            `);
      return rows;
    } catch (err) {
      console.error("Error in displaying purchaseOrder info: ", err);
    }
  },
};
