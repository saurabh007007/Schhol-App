import { Router } from "express";
import {
    createCategory,
    getCategories,
    createItem,
    getItems,
    updateItem,
    deleteItem,
    addStock,
    issueItem,
    returnItem,
    getIssuedItems,
} from "../controllers/inventory.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Categories
router.post("/categories", protect, authorize("ADMIN", "ACCOUNTANT"), createCategory);
router.get("/categories", protect, getCategories);

// Items
router.post("/items", protect, authorize("ADMIN", "ACCOUNTANT"), createItem);
router.get("/items", protect, getItems);
router.put("/items/:id", protect, authorize("ADMIN", "ACCOUNTANT"), updateItem);
router.delete("/items/:id", protect, authorize("ADMIN", "ACCOUNTANT"), deleteItem);

// Stock
router.post("/stock", protect, authorize("ADMIN", "ACCOUNTANT"), addStock);

// Issues
router.post("/issue", protect, authorize("ADMIN", "ACCOUNTANT"), issueItem);
router.post("/return/:id", protect, authorize("ADMIN", "ACCOUNTANT"), returnItem);
router.get("/issued", protect, authorize("ADMIN", "ACCOUNTANT"), getIssuedItems);

export default router;
