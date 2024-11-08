// This is to fetch supplier details at the UI end

module.exports = {
    dispSupplier: async function (pool) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    S.supplierName, 
                    S.address, 
                    GROUP_CONCAT(DISTINCT SP.phno) AS phone_numbers, 
                    GROUP_CONCAT(DISTINCT SE.email) AS emails
                FROM 
                    supplier AS S
                JOIN 
                    supplier_phno AS SP ON S.supplierID = SP.supplierID
                JOIN 
                    supplier_email AS SE ON S.supplierID = SE.supplierID
                GROUP BY 
                    S.supplierID, S.supplierName, S.address;
            `)
            return rows;
        } catch (err) {
            console.error('Some error occured while fetching the joined details of supplier: ', err);
        }
    },
}