import express from 'express';
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all users (for message service to sync with)
router.get("/", protectRoute, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get user by ID
router.get("/:id", protectRoute, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router; 