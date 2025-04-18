import axios from 'axios';

/**
 * Middleware to protect routes by verifying authentication with the user service
 */
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Use the environment variable for the user service URL
        const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5001';
        
        try {
            // Call user service API to validate token and get user
            const response = await axios.get(`${userServiceUrl}/api/auth/validate`, {
                headers: {
                    Cookie: `jwt=${token}`
                },
                withCredentials: true
            });

            // If validation successful, set user in request object
            if (response.data && response.data.valid && response.data.user) {
                req.user = response.data.user;
                next();
            } else {
                return res.status(401).json({ message: 'Not authorized, token validation failed' });
            }
        } catch (error) {
            console.log("Error validating token with user service:", error.message);
            if (error.response) {
                // Handle specific error responses from the user service
                if (error.response.status === 401) {
                    return res.status(401).json({ message: 'Authentication failed - invalid token' });
                } else if (error.response.status === 404) {
                    return res.status(404).json({ message: 'User not found' });
                }
            }
            // For network errors or other issues
            return res.status(500).json({ message: 'Error connecting to authentication service' });
        }
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ message: 'Internal server error during authentication' });
    }
}; 