// Import the mysql2 package
const mysql = require('mysql2');

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    host: 'localhost',        // Database host (localhost for local development)
    user: 'root',   // MySQL username
    password: 'password', // MySQL password
    database: 'invmansys'  // The database name where you want to create the schema
}).promise();

// Function to create the 'student' table
async function createStudentTable() {
    try {
        // Create a 'student' table with studentID and studentName
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS student (
                studentID INT AUTO_INCREMENT PRIMARY KEY,
                studentName VARCHAR(100) NOT NULL
            );
        `;

        // Execute the query
        await pool.query(createTableQuery);

        console.log('Student table created successfully!');
    } catch (error) {
        console.error('Error creating student table:', error);
    } finally {
        // Close the pool connection when done
        pool.end();
    }
}

// Call the function to create the table
createStudentTable();
