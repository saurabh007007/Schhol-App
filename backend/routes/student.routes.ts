import { Router } from "express";
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getAllParents,
    getParentById,
    updateParent,
} from "../controllers/student.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Students
router.get("/", protect, getAllStudents);
router.get("/:id", protect, getStudentById);
router.post("/", protect, authorize("ADMIN", "TEACHER"), createStudent);
router.put("/:id", protect, authorize("ADMIN", "TEACHER"), updateStudent);
router.delete("/:id", protect, authorize("ADMIN"), deleteStudent);

// Parents
router.get("/parents/all", protect, getAllParents);
router.get("/parents/:id", protect, getParentById);
router.put("/parents/:id", protect, authorize("ADMIN", "TEACHER"), updateParent);

export default router;
