import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { addStudents } from "../controllers/admin.controllers";
import { isLogin } from "../middlewares/isLogin.middleware";

const router = Router();
//student related
router.post("/students/add", isLogin, isAdmin, addStudents);
router.patch("/students/update/:id", isLogin, isAdmin, addStudents);

export default router;
