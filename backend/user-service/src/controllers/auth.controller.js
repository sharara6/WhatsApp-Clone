import { generateToken } from '../lib/utils.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import minioClient from '../lib/minio.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findByEmail(email);
    
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            full_name: fullName,
            email,
            password: hashedPassword,
        });
        
        if (newUser) {
            generateToken(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                fullName: newUser.full_name,
                email: newUser.email,
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data failed to create user' });
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            fullName: user.full_name,
            email: user.email,
        });
    } catch (error) {
        console.log("Error in login controller:", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', {maxAge: 0});
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const user_id = req.user.id;

        if(!profilePic) {
            return res.status(400).json({ message: 'Profile pic required' });
        }

        try {
            // Remove the data URL prefix if present
            const base64Data = profilePic.includes('base64,') ? profilePic.split('base64,')[1] : profilePic;
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `profile-${user_id}-${Date.now()}.jpg`;
            
            // Upload to MinIO with metadata
            await minioClient.putObject('profile-pictures', fileName, buffer, {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': 'inline',
            });

            const profilePicUrl = `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/profile-pictures/${fileName}`;
            
            const updatedUser = await User.update(user_id, { profile_pic: profilePicUrl });
            
            res.status(200).json({
                id: updatedUser.id,
                fullName: updatedUser.full_name,
                email: updatedUser.email,
                profilePic: updatedUser.profile_pic,
            });
        } catch (error) {
            console.log("Error in updateProfile controller:", error.message);
            return res.status(500).json({ message: 'Error uploading profile picture' });
        }
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        res.status(200).json({
            id: req.user.id,
            fullName: req.user.full_name,
            email: req.user.email,
            profilePic: req.user.profile_pic
        });
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const validateToken = (req, res) => {
    try {
        res.status(200).json({ valid: true });
    } catch (error) {
        console.log("Error in validateToken controller:", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}; 