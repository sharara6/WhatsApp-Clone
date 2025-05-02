import express from 'express';
import { User } from "../models/user.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

router.get("/", protectRoute, async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, full_name, email, profile_pic')
            .neq('id', req.user.id); // Exclude the current user
        
        if (error) throw error;
        
        // Transform the data to match the frontend expectations
        const transformedUsers = users.map(user => ({
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            profilePic: user.profile_pic
        }));
        
        res.status(200).json(transformedUsers);
    } catch (error) {
        console.error("Error getting users:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", protectRoute, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({
            id: userWithoutPassword.id,
            fullName: userWithoutPassword.full_name,
            email: userWithoutPassword.email,
            profilePic: userWithoutPassword.profile_pic
        });
    } catch (error) {
        console.error("Error getting user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/update-profile", protectRoute, updateProfile);
router.put("/update-profile", protectRoute, updateProfile);

export default router; 