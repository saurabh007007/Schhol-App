import { Router } from "express";
import {
    createSchoolProfile,
    getSchoolProfile,
    updateSchoolProfile,
    getAcademicYears,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    getSessions,
    createSession,
    updateSession,
    deleteSession,
} from "../controllers/settings.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// School Profile
router.post("/school-profile", protect, authorize("ADMIN"), createSchoolProfile);
router.get("/school-profile", protect, getSchoolProfile);
router.put("/school-profile", protect, authorize("ADMIN"), updateSchoolProfile);

// Academic Years
router.get("/academic-years", protect, getAcademicYears);
router.post("/academic-years", protect, authorize("ADMIN"), createAcademicYear);
router.put("/academic-years/:id", protect, authorize("ADMIN"), updateAcademicYear);
router.delete("/academic-years/:id", protect, authorize("ADMIN"), deleteAcademicYear);

// Sessions

export default router;
