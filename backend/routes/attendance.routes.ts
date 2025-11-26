import { Router } from "express";
import {
    markStudentAttendance,
    markBulkStudentAttendance,
    getStudentAttendance,
    markStaffAttendance,
    getStaffAttendance,
} from "../controllers/attendance.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Student Attendance
router.post("/student", protect, authorize("TEACHER", "ADMIN"), markStudentAttendance);
router.post("/student/bulk", protect, authorize("TEACHER", "ADMIN"), markBulkStudentAttendance);
router.get("/student", protect, getStudentAttendance);

// Staff Attendance
router.post("/staff", protect, authorize("ADMIN"), markStaffAttendance);
router.get("/staff", protect, authorize("ADMIN"), getStaffAttendance);

export default router;
