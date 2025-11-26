import { Router } from "express";
import {
    createFeeGroup,
    getFeeGroups,
    createFeeType,
    getFeeTypes,
    createFeeStructure,
    getFeeStructures,
    assignFeesToStudent,
    getStudentFees,
    collectFeePayment,
    createExpense,
    getExpenses,
} from "../controllers/fee.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Fee Setup
router.post("/groups", protect, authorize("ADMIN", "ACCOUNTANT"), createFeeGroup);
router.get("/groups", protect, getFeeGroups);
router.post("/types", protect, authorize("ADMIN", "ACCOUNTANT"), createFeeType);
router.get("/types", protect, getFeeTypes);
router.post("/structures", protect, authorize("ADMIN", "ACCOUNTANT"), createFeeStructure);
router.get("/structures", protect, getFeeStructures);

// Student Fees
router.post("/assign", protect, authorize("ADMIN", "ACCOUNTANT"), assignFeesToStudent);
router.get("/student/:studentId", protect, getStudentFees);
router.post("/payment", protect, authorize("ADMIN", "ACCOUNTANT"), collectFeePayment);

// Expenses
router.post("/expenses", protect, authorize("ADMIN", "ACCOUNTANT"), createExpense);
router.get("/expenses", protect, authorize("ADMIN", "ACCOUNTANT"), getExpenses);

export default router;
