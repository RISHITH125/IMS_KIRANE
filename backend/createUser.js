const { fetchData, createStoreDatabase, loginCreate, del_user } = require('./login.js');

module.exports = {
    createUser: async function(pool) {
        // Create a readline interface for user input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        // Function to prompt user input
        const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
    
        try {
            // Prompt for user details
            const fullname = await prompt('Enter full name: ');
            const password = await prompt('Enter password: ');
            const username = await prompt('Enter username: ');
            const storename = await prompt('Enter storename: ');
            const email = await prompt('Enter email/s: ');
            const phno = await prompt('Enter phone number/s: ');
            // Split the input strings into arrays
            const emailArray = email.split(',').map(e => e.trim());
            const phnoArray = phno.split(',').map(p => p.trim());
    
            await createStoreDatabase(pool, storename);
            await loginCreate(pool, fullname, password, storename, username, emailArray, phnoArray);
            await fetchData(pool);
        } catch (err) {
            console.error('Error creating user:', err.message);
        } finally {
            rl.close();  // Close the readline interface
        }
    }
}