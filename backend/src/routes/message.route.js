import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersInSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';
import express from 'express';

const router = express.Router();

router.get("/users", protectRoute, getUsersInSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;