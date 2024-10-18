const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
    const saltRounds = 10; // Adjust salt rounds for security
    return await bcrypt.hash(plainPassword, saltRounds);
}

module.exports = {
    fetchData: async function(pool) {
        try {
            const [rows] = await pool.query(`
                SELECT * FROM user
                JOIN user_email ON user.userid = user_email.userid
                JOIN user_phno ON user.userid = user_phno.userid;
            `);
            console.log(rows); // Display the result in the console
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    },

    createStoreDatabase: async function(pool, storename) {
        try {
            // Create the database dynamically
            await pool.query(`CREATE DATABASE IF NOT EXISTS \`${storename}\`;`);

            // Use the newly created database
            await pool.query(`USE \`${storename}\`;`);

            // Create the 'user' table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS user (
                    userid INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL,
                    fullname VARCHAR(50) NOT NULL, 
                    dateCreated DATE NOT NULL,
                    passwordhash VARCHAR(255) NOT NULL,
                    storename VARCHAR(50) NOT NULL
                );
            `);

            await pool.query(`
                CREATE TABLE IF NOT EXISTS user_phno (
                    userid INT,
                    phno VARCHAR(10) CHECK(LENGTH(phno) = 10) NOT NULL,
                    FOREIGN KEY (userid) REFERENCES user(userid)
                );
            `);

            await pool.query(`
                CREATE TABLE IF NOT EXISTS user_email (
                    userid INT,
                    email VARCHAR(50),
                    FOREIGN KEY (userid) REFERENCES user(userid)
                );
            `);
            
            // Create the supplier table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS supplier (
                    supplierID INT PRIMARY KEY,
                    address VARCHAR(255) NOT NULL,
                    supplierName VARCHAR(50) NOT NULL
                );
            `);
            
            // Create the supplier_phno table for multivalued phone numbers
            await pool.query(`
                CREATE TABLE IF NOT EXISTS supplier_phno (
                    supplierID INT,
                    phno VARCHAR(10) CHECK(LENGTH(phno) = 10) NOT NULL,  -- Assuming phone numbers are 10 digits
                    FOREIGN KEY (supplierID) REFERENCES supplier(supplierID)
                );
            `);
            
            // Create the supplier_email table for multivalued email addresses
            await pool.query(`
                CREATE TABLE IF NOT EXISTS supplier_email (
                    supplierID INT,
                    email VARCHAR(50) NOT NULL,
                    FOREIGN KEY (supplierID) REFERENCES supplier(supplierID)
                );
            `);

            await pool.query(`
                CREATE TABLE IF NOT EXISTS category (
                    categoryID INT PRIMARY KEY,
                    description TEXT NOT NULL,     -- Using TEXT for a potentially larger description
                    categoryName VARCHAR(50) NOT NULL
                );
            `);

            await pool.query(`
                CREATE TABLE IF NOT EXISTS product (
                    productid INT PRIMARY KEY,
                    productName VARCHAR(50) NOT NULL,
                    price FLOAT NOT NULL,
                    supplierID INT,
                    categoryID INT,
                    quantity INT,                 -- Specify data type for quantity
                    reorderLevel INT,            -- Specify data type for reorderLevel
                    expiry DATE,
                    dateadded DATE,
                    FOREIGN KEY (supplierID) REFERENCES suppliers(supplierID),   -- Assuming you have a suppliers table
                    FOREIGN KEY (categoryID) REFERENCES categories(categoryID)    -- Assuming you have a categories table
                );
            `);
            console.log(`Database and user, products, category, supplier table for store '${storename}' created successfully.`);
        } catch (err) {
            console.error('Error creating store database:', err);
        }
    },

    loginCreate: async function(pool, fullname, password, storename, username, email, phno) {
        try {
            const hashedPassword = await hashPassword(password);
            const currentDate = new Date().toISOString().split('T')[0];
            
            const [userResult] = await pool.query(`
                INSERT INTO user(username, fullname, dateCreated, passwordhash, storename)
                VALUES (?, ?, ?, ?, ?)`, [username, fullname, currentDate, hashedPassword, storename]);

            const userId = userResult.insertId;

            // Store phone numbers
            for (const pn of phno) {
                await pool.query("INSERT INTO user_phno (userid, phno) VALUES (?, ?)", [userId, pn]);
            }

            // Store emails
            for (const em of email) {
                await pool.query("INSERT INTO user_email (userid, email) VALUES (?, ?)", [userId, em]);
            }
        } catch (err) {
            console.error("Couldn't insert details of the user...", err);
        }
    },

    del_user: async function(pool, storename) {
        try {
            await pool.query('DROP DATABASE ??', [storename]);
            console.log(`Deleted ${storename}`);
        } catch (err) {
            console.error(`Error deleting ${storename}:`, err);
        }
    }
};
