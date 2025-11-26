import { Router } from "express";
import {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../controllers/staff.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Staff
router.get("/", protect, getAllStaff);
router.get("/:id", protect, getStaffById);
router.post("/", protect, authorize("ADMIN"), createStaff);
router.put("/:id", protect, authorize("ADMIN"), updateStaff);
router.delete("/:id", protect, authorize("ADMIN"), deleteStaff);

// Departments
router.get("/departments/all", protect, getDepartments);
router.post("/departments", protect, authorize("ADMIN"), createDepartment);
router.put("/departments/:id", protect, authorize("ADMIN"), updateDepartment);
router.delete("/departments/:id", protect, authorize("ADMIN"), deleteDepartment);

export default router;
