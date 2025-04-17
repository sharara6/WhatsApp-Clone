import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
export const signup = async (req, res) => {
    const { fullName,email, password } = req.body;
    try {
       if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
    
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                password: newUser.password,
            });
        }else{
            return res.status(400).json({ message: 'Invalid user data failed to create user' });
        }

    } catch (error) {
        console.log("error in signup controller",error.message);
        return res.status(500).json({ message: 'internal server error' });
    }
}

export const login = (req, res) => {
    res.send('signup Page');
}

export const logout = (req, res) => {
    res.send('Logout Page');
}