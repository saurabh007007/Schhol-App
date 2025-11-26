import { Router } from "express";
import {
    createNotice,
    getNotices,
    deleteNotice,
    createEvent,
    getEvents,
} from "../controllers/communication.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Notices
router.post("/notices", protect, authorize("ADMIN", "TEACHER"), createNotice);
router.get("/notices", protect, getNotices);
router.delete("/notices/:id", protect, authorize("ADMIN", "TEACHER"), deleteNotice);

// Events
router.post("/events", protect, authorize("ADMIN", "TEACHER"), createEvent);
router.get("/events", protect, getEvents);

export default router;
