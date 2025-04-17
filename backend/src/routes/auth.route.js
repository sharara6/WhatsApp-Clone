import expresss from 'express';
import { login, logout, signup } from "../controllers/auth.controller.js";




const router = expresss.Router();

router.post("/login", login);

router.post("/logout", logout);

router.post("/signup", signup);
export default router ; 