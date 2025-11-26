import { Router } from "express";
import {
    getClasses,
    createClass,
    updateClass,
    deleteClass,
    getSections,
    createSection,
    updateSection,
    deleteSection,
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectAllocations,
    createSubjectAllocation,
    deleteSubjectAllocation,
} from "../controllers/academic.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Classes
router.get("/classes", protect, getClasses);
router.post("/classes", protect, authorize("ADMIN"), createClass);
router.put("/classes/:id", protect, authorize("ADMIN"), updateClass);
router.delete("/classes/:id", protect, authorize("ADMIN"), deleteClass);

// Sections
router.get("/sections", protect, getSections);
router.post("/sections", protect, authorize("ADMIN"), createSection);
router.put("/sections/:id", protect, authorize("ADMIN"), updateSection);
router.delete("/sections/:id", protect, authorize("ADMIN"), deleteSection);

// Subjects
router.get("/subjects", protect, getSubjects);
router.post("/subjects", protect, authorize("ADMIN"), createSubject);
router.put("/subjects/:id", protect, authorize("ADMIN"), updateSubject);
router.delete("/subjects/:id", protect, authorize("ADMIN"), deleteSubject);

// Allocations
router.get("/allocations", protect, getSubjectAllocations);
router.post("/allocations", protect, authorize("ADMIN"), createSubjectAllocation);
router.delete("/allocations/:id", protect, authorize("ADMIN"), deleteSubjectAllocation);

export default router;
