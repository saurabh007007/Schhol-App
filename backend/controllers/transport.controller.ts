import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const vehicleSchema = z.object({
    vehicleNo: z.string().min(1),
    type: z.enum(["BUS", "VAN", "CAR"]),
    capacity: z.number().min(1),
    driverName: z.string().optional(),
    driverPhone: z.string().optional(),
    licenseNo: z.string().optional(),
});

const routeSchema = z.object({
    title: z.string().min(1),
    vehicleId: z.number(),
    fare: z.number(),
    driverId: z.number().optional(),
});

const stopSchema = z.object({
    routeId: z.number(),
    name: z.string().min(1),
    pickupTime: z.string(),
    dropTime: z.string(),
    fare: z.number().optional(),
});

const memberSchema = z.object({
    routeId: z.number(),
    studentId: z.number(),
    pickupPoint: z.string().optional(),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()).optional(),
});

// Vehicle
export const createVehicle = async (req: Request, res: Response) => {
    try {
        const data = vehicleSchema.parse(req.body);
        const vehicle = await prisma.vehicle.create({ data });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: "Error creating vehicle", error });
    }
};

export const getVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await prisma.vehicle.findMany();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vehicles", error });
    }
};

export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = vehicleSchema.partial().parse(req.body);
        const vehicle = await prisma.vehicle.update({
            where: { id: Number(id) },
            data,
        });
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ message: "Error updating vehicle", error });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.vehicle.delete({ where: { id: Number(id) } });
        res.json({ message: "Vehicle deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting vehicle", error });
    }
};

// Route
export const createRoute = async (req: Request, res: Response) => {
    try {
        const data = routeSchema.parse(req.body);
        const route = await prisma.transportRoute.create({ data });
        res.status(201).json(route);
    } catch (error) {
        res.status(400).json({ message: "Error creating route", error });
    }
};

export const getRoutes = async (req: Request, res: Response) => {
    try {
        const routes = await prisma.transportRoute.findMany({
            include: { vehicle: true, stops: true, _count: { select: { members: true } } },
        });
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching routes", error });
    }
};

export const updateRoute = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = routeSchema.partial().parse(req.body);
        const route = await prisma.transportRoute.update({
            where: { id: Number(id) },
            data,
        });
        res.json(route);
    } catch (error) {
        res.status(400).json({ message: "Error updating route", error });
    }
};

export const deleteRoute = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.transportRoute.delete({ where: { id: Number(id) } });
        res.json({ message: "Route deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting route", error });
    }
};

// Stop
export const createStop = async (req: Request, res: Response) => {
    try {
        const data = stopSchema.parse(req.body);
        const stop = await prisma.transportStop.create({ data });
        res.status(201).json(stop);
    } catch (error) {
        res.status(400).json({ message: "Error creating stop", error });
    }
};

export const deleteStop = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.transportStop.delete({ where: { id: Number(id) } });
        res.json({ message: "Stop deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting stop", error });
    }
};

// Member
export const assignTransport = async (req: Request, res: Response) => {
    try {
        const data = memberSchema.parse(req.body);
        const member = await prisma.transportMember.create({
            data: {
                routeId: data.routeId,
                studentId: data.studentId,
                pickupPoint: data.pickupPoint,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                status: "ACTIVE",
            },
        });
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: "Error assigning transport", error });
    }
};

export const getTransportMembers = async (req: Request, res: Response) => {
    try {
        const { routeId } = req.query;
        const where: any = {};
        if (routeId) where.routeId = Number(routeId);

        const members = await prisma.transportMember.findMany({
            where,
            include: { student: { select: { firstName: true, lastName: true, admissionNo: true } } },
        });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Error fetching members", error });
    }
};
