import { Router } from "express";
import { Login, Logout, getUserProfile, Signup } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/me", protect, getUserProfile);

export default router;
