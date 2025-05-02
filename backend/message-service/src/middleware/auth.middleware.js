import axios from 'axios';


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        
        const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5001';
        
        try {
            
            const response = await axios.get(`${userServiceUrl}/api/auth/check`, {
                headers: {
                    Cookie: `jwt=${token}`
                },
                withCredentials: true
            });

            
            if (response.data) {
                req.user = {
                    id: response.data.id,
                    full_name: response.data.fullName,
                    email: response.data.email,
                    profile_pic: response.data.profilePic
                };
                next();
            } else {
                return res.status(401).json({ message: 'Not authorized, token validation failed' });
            }
        } catch (error) {
            console.log("Error validating token with user service:", error.message);
            if (error.response) {
                
                if (error.response.status === 401) {
                    return res.status(401).json({ message: 'Authentication failed - invalid token' });
                } else if (error.response.status === 404) {
                    return res.status(404).json({ message: 'User not found' });
                }
            }
            
            return res.status(500).json({ message: 'Error connecting to authentication service' });
        }
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ message: 'Internal server error during authentication' });
    }
}; 