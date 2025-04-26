const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        // Get JWT from cookies
        const token = req.cookies.jwt;
        
        console.log(`Auth check for ${req.method} ${req.originalUrl}`);
        console.log('Cookies:', req.cookies);
        
        if (!token) {
            console.log('Auth middleware: No token in cookies');
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!decoded) {
                console.log('Auth middleware: Token verification failed');
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }
            
            // Add user info to request
            req.user = decoded;
            console.log(`User authenticated: ${decoded.userId}`);
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError.message);
            return res.status(401).json({ message: 'Not authorized, token validation failed', details: jwtError.message });
        }
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ message: 'Not authorized, general error', details: error.message });
    }
};

const setupAuth = (app, routes) => {
    console.log('Setting up auth for routes:');
    
    // Create a map of public routes for quick lookups
    const publicEndpoints = [
        '/api/auth/login',
        '/api/auth/signup',
        '/api/auth/register',
        '/health',
        '/debug'
    ];
    
    routes.forEach(r => {
        if (r.auth) {
            console.log(`- Protected route: ${r.url}`);
            app.use(r.url, (req, res, next) => {
                // Skip OPTIONS requests (for CORS preflight)
                if (req.method === 'OPTIONS') {
                    return next();
                }
                
                // Skip auth for public endpoints
                const fullPath = req.originalUrl.split('?')[0]; // Remove query params
                if (publicEndpoints.includes(fullPath)) {
                    console.log(`Allowing public access to ${fullPath}`);
                    return next();
                }
                
                // Skip auth for login and register endpoints
                if (r.url === '/api/auth' && 
                    (req.path === '/login' || req.path === '/register' || req.path === '/signup')) {
                    console.log(`Allowing public access to ${r.url}${req.path}`);
                    return next();
                }
                
                verifyToken(req, res, next);
            });
        } else {
            console.log(`- Public route: ${r.url}`);
        }
    });
};

exports.setupAuth = setupAuth;