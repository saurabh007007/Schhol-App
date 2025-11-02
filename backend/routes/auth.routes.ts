import { Router } from "express";
import {
  Signup,
  Login,
  getUserProfile,
  Logout,
} from "../controllers/login.controllers";
import { isLogin } from "../middlewares/isLogin.middleware";

const router = Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/get-user-profile", isLogin, getUserProfile);
router.get("/logout", Logout);

export default router;
