import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router();

router.post("/add-student", isAdmin);

export default router;
