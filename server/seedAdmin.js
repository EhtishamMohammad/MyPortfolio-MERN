import bcrypt from 'bcryptjs'; // Importing bcryptjs module for hashing passwords
import User from './models/user.model.js'; // Importing the User model to interact with the database for user creation and retrieval

const seedAdmin = async () => {
    // Function to seed an admin user in the database if it doesn't already exist
    try {
        const name = process.env.ADMIN_NAME?.trim(); // Retrieving the admin name from environment variables
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase(); // Retrieving the admin email from environment variables, trimming whitespace, and converting to lowercase
        const password = process.env.ADMIN_PASSWORD; // Retrieving the admin password from environment variables
        // Checking if the required environment variables for admin user creation are set
        if (!name || !email || !password) {
            throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD environment variables must be set.');
        }

        // Querying the database to check if an admin user with the specified email already exists
        let adminUser = await User.findOne({ email });

        // If an admin user with the specified email exists, check if they have the 'admin' role. If not, update their role to 'admin'. If they already have the 'admin' role, log a message indicating that no changes were made. If no admin user exists, create a new admin user with the specified name, email, hashed password, and role set to 'admin'.
        if (adminUser) {
            if (adminUser.role !== 'admin') {
                adminUser.role = 'admin';
                await adminUser.save(); // Updating the existing user to have the 'admin' role if they are not already an admin
                console.log('Existing account now promoted to admin.');
            } else {
                console.log('Admin user already exists. No changes made.');
            }
            return; 
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Creating a new admin user in the database with the specified name, email, hashed password, and role set to 'admin'
        adminUser = await User.create({
            name,
            email,   
            password: hashedPassword,
            role: 'admin',
        });
        console.log('Admin user created successfully:');
    } catch (error) {
        console.error('Error seeding admin user:', error.message);
        throw error; // Rethrow the error to be handled by the caller
    }
};

export default seedAdmin;