const admin = (req, res, next) => {
    // Checking if the user object exists on the request and if the user's role is not 'admin'
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    // Checking if wether the authenicated use is an admin.
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next(); // Calling the next middleware function in the stack to continue processing the request if the user is an admin
}
export default admin; // Exporting the admin middleware function to be used in other parts of the application, such as in route handlers that require admin access