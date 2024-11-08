// updated category description to contain null values 04/11/2024

const bcrypt = require('bcrypt');
const mysql = require('mysql2');

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

    // this is for /login api
    loginPage: async function (genpool, email, password) {
        try {
            await genpool.query(`USE store;`);
    
            const [rows] = await genpool.query(
                `SELECT storename FROM user WHERE email = ? AND password = ?`,
                [email, password]
            );
    
            if (rows.length === 0) {
                return {
                    success: false,
                    message: "User not found or incorrect credentials",
                };
            } else {
                return {
                    success: true,
                    data: rows[0] // Assuming you want the first matching row
                };
            }
        } catch (err) {
            console.error("Wasn't able to access the store database or the user table does not exist!", err);
            return {
                success: false,
                message: "Database error",
                error: err
            };
        }
    },    

    // this is for signup endpoint
    signUpPage: async function (genpool, username, email, password) {
        try {
            await genpool.query(`USE store;`);
            
            // Check if the user already exists
            const [rows] = await genpool.query(`
                SELECT storename FROM user WHERE username = ? AND email = ? AND passwordhash = SHA2(?, 256)
            `, [username, email, password]);
    
            if (rows.length === 0) {
                // Insert new user if they don't exist
                await genpool.query(`
                    INSERT INTO user (username, email, passwordhash, dateCreated) 
                    VALUES (?, ?, SHA2(?, 256), CURDATE());
                `, [username, email, password]);
    
                return {
                    success: true,
                    message: "User registered successfully!"
                };
            } else {
                return {
                    success: false,
                    message: "Account already exists!"
                };
            }
        } catch (err) {
            console.error('Error while inserting into user table:', err);
            return {
                success: false,
                message: "Database error",
                error: err
            };
        }
    },
    

    // this is for the auth page
    googleAuth: async function (genpool, username, email, jti) {
        try {
            // Check if the user with Google Auth exists
            const [rows] = await genpool.query(`
                SELECT storename FROM user WHERE username = ? AND email = ? AND jti = ?
            `, [username, email, jti]);
    
            if (rows.length === 0) {
                // Insert new user if they don't exist
                await genpool.query(`
                    INSERT INTO user (username, email, jti, dateCreated) 
                    VALUES (?, ?, ?, CURDATE());
                `, [username, email, jti]);
    
                return {
                    success: true,
                    message: "New user registered with Google Auth!"
                };
            } else {
                return {
                    success: true,
                    message: "Account exists"
                };
            }
        } catch (err) {
            console.error("Couldn't add or verify details:", err);
            return {
                success: false,
                message: "Database error",
                error: err
            };
        }
    },    

    createStoreDatabase: async function(genpool, storename) {
        try {
            // Create the database dynamically
            await genpool.query(`CREATE DATABASE IF NOT EXISTS \`${storename}\`;`);

            const pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME, // Now use the new database
            }).promise();
    

            // Use the newly created database
            await pool.query(`USE \`${storename}\`;`);

            // location attribute must be added
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
                    supplierID INT AUTO_INCREMENT PRIMARY KEY,
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
                    categoryID INT AUTO_INCREMENT PRIMARY KEY,
                    description TEXT,     -- Using TEXT for a potentially larger description
                    categoryName VARCHAR(50) NOT NULL
                );
            `);

            await pool.query(`
                CREATE TABLE IF NOT EXISTS product (
                    productid INT AUTO_INCREMENT PRIMARY KEY,
                    productName VARCHAR(50) NOT NULL,
                    price FLOAT NOT NULL,
                    supplierID INT,
                    categoryID INT,
                    quantity INT,                 -- Specify data type for quantity
                    reorderLevel INT,            -- Specify data type for reorderLevel
                    expiry DATE,
                    dateadded DATE,
                    FOREIGN KEY (supplierID) REFERENCES supplier(supplierID),   -- Assuming you have a suppliers table
                    FOREIGN KEY (categoryID) REFERENCES category(categoryID)    -- Assuming you have a categories table
                );
            `);

            await pool.query(`
                CREATE TABLE IF NOT EXISTS sales (
                    salesid INT AUTO_INCREMENT PRIMARY KEY,    -- Unique identifier for each sale
                    productid INT,                             -- Foreign key to the Product table
                    quantitySold INT NOT NULL,                 -- Quantity sold in this sale
                    salesPrice DECIMAL(10, 2) NOT NULL,        -- Price at which the product was sold
                    totalAmount DECIMAL(10, 2) AS (quantitySold * SalesPrice) STORED, -- Total amount for this sale
                    paymentMethod VARCHAR(40),                 -- Method of payment used (e.g., cash, card)
                    FOREIGN KEY (productID) REFERENCES product(productid)
                );
            `)

            // Here i added productid as a new attribute in order to update the inventory when the supplier supplies
            // the product.
            await pool.query(`              
                CREATE TABLE IF NOT EXISTS purchaseOrder (
                    purchaseOrderid INT AUTO_INCREMENT PRIMARY KEY,
                    orderStatus TINYINT CHECK (orderStatus IN (0, 1)) NOT NULL,
                    deliveryDate DATE NOT NULL,
                    orderDate DATE NOT NULL,
                    quantity DECIMAL(10, 2) NOT NULL,
                    supplierID INT,
                    productid INT, 
                    FOREIGN KEY (supplierID) REFERENCES supplier(supplierID),
                    FOREIGN KEY (productID) REFERENCES product(productid)
                )`)
            console.log(`Database and user, products, category, supplier table for store '${storename}' created successfully.`);

            return pool;
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
