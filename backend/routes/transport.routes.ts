import { Router } from "express";
import {
    createVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle,
    createRoute,
    getRoutes,
    updateRoute,
    deleteRoute,
    createStop,
    deleteStop,
    assignTransport,
    getTransportMembers,
} from "../controllers/transport.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Vehicles
router.post("/vehicles", protect, authorize("ADMIN"), createVehicle);
router.get("/vehicles", protect, getVehicles);
router.put("/vehicles/:id", protect, authorize("ADMIN"), updateVehicle);
router.delete("/vehicles/:id", protect, authorize("ADMIN"), deleteVehicle);

// Routes
router.post("/routes", protect, authorize("ADMIN"), createRoute);
router.get("/routes", protect, getRoutes);
router.put("/routes/:id", protect, authorize("ADMIN"), updateRoute);
router.delete("/routes/:id", protect, authorize("ADMIN"), deleteRoute);

// Stops
router.post("/stops", protect, authorize("ADMIN"), createStop);
router.delete("/stops/:id", protect, authorize("ADMIN"), deleteStop);

// Members
router.post("/members", protect, authorize("ADMIN"), assignTransport);
router.get("/members", protect, getTransportMembers);

export default router;
