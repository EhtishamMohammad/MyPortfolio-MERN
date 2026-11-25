import jwt from 'jsonwebtoken'; // Importing jsonwebtoken module for generating and verifying JWT tokens
import User from '../models/user.model.js'; // Importing the User model to query the database for user information

const auth = async (req, res, next) => {
    { // Middleware function to authenticate requests using JWT tokens
    const authorization = req.headers.authorization; // Retrieving the authorization header from the request headers

    if (!authorization || !authorization.startsWith('Bearer ')) { // Checking if the authorization header is missing or does not start with 'Bearer '
        return res.status(401).json({ // Returning a 401 Unauthorized response if the authorization header is missing or invalid
            message: 'Authentication token required' // Providing a message indicating that an authentication token is required
        });
    }

    const token = authorization.split(' ')[1]; // Extracting the token from the authorization header by splitting the string and taking the second part

    if (!process.env.JWT_SECRET) { // Checking if the JWT_SECRET environment variable is not set, which is required for verifying the JWT token
            return res.status(500).json({ // Returning a 401 Unauthorized response if the JWT_SECRET is not configured
                message: 'Authentication is not configured' // Providing a message indicating that the authentication is not configured
            });
        }
    let decoded; // Declaring a variable to hold the decoded payload from the JWT token
    
    // Using a try-catch block to handle any errors that may occur during token verification
    try {
            decoded =jwt.verify(token, process.env.JWT_SECRET); // Verifying the token using the JWT_SECRET from the environment variables and decoding the payload 
        } catch (error) {
            return res.status(401).json({
                message: 'Invalid or expired token' // Providing a message indicating that the token is invalid or expired
            })
        }
        // Using a try-catch block to handle any errors that may occur during the user lookup
        try {
            const user = await User.findById(decoded.userID); // Querying the database to find the user by their ID, which is extracted from the decoded token payload
            if (!user) {
                return res.status(401).json({
                    message: 'User not found' // Providing a message indicating that the user was not found in the database
                })
            }
            req.user = {
                userID: user._id.toString(), // Attaching the user's ID to the request object for use in subsequent middleware or route handlers
                name: user.name, // Attaching the user's name to the request object for use in subsequent middleware or route handlers
                email: user.email, // Attaching the user's email to the request object for use in subsequent middleware or route handlers
                role: user.role // Attaching the user's role to the request object for use in subsequent middleware or route handlers
            };
            next(); // Calling the next middleware function in the stack to continue processing the request
        } catch (error) {
            console.error('Authentication error:', error); // Logging any errors that occur during the authentication process
            return res.status(500).json({
                message: 'Authentication error' // Providing a message indicating that an internal server error occurred
            });
        }
    }
}
export default auth;