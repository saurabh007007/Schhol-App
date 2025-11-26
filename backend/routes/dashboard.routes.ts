import { Router } from "express";
import {
    getDashboardStats,
    getRecentActivities,
    getAttendanceOverview,
} from "../controllers/dashboard.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/stats", protect, authorize("ADMIN"), getDashboardStats);
router.get("/activities", protect, authorize("ADMIN"), getRecentActivities);
router.get("/attendance", protect, authorize("ADMIN"), getAttendanceOverview);

export default router;
