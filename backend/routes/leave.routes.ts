import { Router } from "express";
import {
    applyLeave,
    getLeaveApplications,
    updateLeaveStatus,
    getHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
} from "../controllers/leave.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Leave
router.post("/apply", protect, applyLeave);
router.get("/applications", protect, getLeaveApplications);
router.put("/applications/:id/status", protect, authorize("ADMIN", "TEACHER"), updateLeaveStatus);

// Holidays
router.get("/holidays", protect, getHolidays);
router.post("/holidays", protect, authorize("ADMIN"), createHoliday);
router.put("/holidays/:id", protect, authorize("ADMIN"), updateHoliday);
router.delete("/holidays/:id", protect, authorize("ADMIN"), deleteHoliday);

export default router;
