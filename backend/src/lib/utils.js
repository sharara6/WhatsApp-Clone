import jwt from 'jsonwebtoken';
export const generateToken = (userId,res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
         expiresIn: '7d' 
    })
        
    
    res.cookie('jwt', token, { 
        maxAge: 7*24*60*60*1000, //  1 day in milliseconds
        httpOnly: true, // The cookie is not accessible via JavaScript(this prevents XSS(cross site scripting) attacks)
        sameSite: 'strict', // The cookie is not sent along with cross-site requests (this prevents CSRF(cross site request forgery) attacks)
        secure: process.env.NODE_ENV !== 'development', // The cookie is only sent over HTTPS in production
    });

    return token;
}