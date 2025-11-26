import { Router } from "express";
import {
    createExam,
    getExams,
    deleteExam,
    createExamSchedule,
    getExamSchedules,
    addExamResult,
    getExamResults,
} from "../controllers/exam.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Exams
router.post("/exams", protect, authorize("ADMIN", "TEACHER"), createExam);
router.get("/exams", protect, getExams);
router.delete("/exams/:id", protect, authorize("ADMIN", "TEACHER"), deleteExam);

// Schedules
router.post("/schedules", protect, authorize("ADMIN", "TEACHER"), createExamSchedule);
router.get("/schedules", protect, getExamSchedules);

// Results
router.post("/results", protect, authorize("ADMIN", "TEACHER"), addExamResult);
router.get("/results", protect, getExamResults);

export default router;
