// This is to validate the user wanting to log in. called in main.js to handle 
// logging in

module.exports = {
    loginUser: async function (pool, username, password) {
        try {
            await pool.query(`USE store;`)
            // Fetch user data based on username
            const [rows] = await pool.query(`
                SELECT userid, fullname, storename, passwordhash 
                FROM user 
                WHERE username = ?
            `, [username]);
    
            // Check if user exists
            if (rows.length === 0) {
                return { success: false, message: "User not found" };
            }
    
            const user = rows[0];
    
            // Compare provided password with stored hash
            const isMatch = await bcrypt.compare(password, user.passwordhash);
            if (!isMatch) {
                return { success: false, message: "Incorrect password" };
            }
    
            // If password matches, return user info
            return {
                success: true,
                message: "Login successful",
                user: {
                    userid: user.userid,
                    fullname: user.fullname,
                    storename: user.storename
                }
            };
        } catch (error) {
            console.error("Error during login:", error);
            return { success: false, message: "An error occurred" };
        }
    }
}