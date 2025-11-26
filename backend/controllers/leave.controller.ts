import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const leaveApplicationSchema = z.object({
    staffId: z.number(),
    type: z.string().min(1),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    reason: z.string().min(1),
});

const leaveStatusSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
    approvedBy: z.number(),
    rejectionReason: z.string().optional(),
});

const holidaySchema = z.object({
    title: z.string().min(1),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    description: z.string().optional(),
    type: z.string().optional(),
});

// Leave Management
export const applyLeave = async (req: Request, res: Response) => {
    try {
        const data = leaveApplicationSchema.parse(req.body);
        const leave = await prisma.leaveApplication.create({
            data: {
                staffId: data.staffId,
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                reason: data.reason,
                status: "PENDING",
            },
        });
        res.status(201).json(leave);
    } catch (error) {
        res.status(400).json({ message: "Error applying for leave", error });
    }
};

export const getLeaveApplications = async (req: Request, res: Response) => {
    try {
        const { staffId, status } = req.query;

        const where: any = {};
        if (staffId) where.staffId = Number(staffId);
        if (status) where.status = status as string;

        const leaves = await prisma.leaveApplication.findMany({
            where,
            include: { staff: { select: { firstName: true, lastName: true, designation: true } } },
            orderBy: { createdAt: "desc" },
        });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leave applications", error });
    }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = leaveStatusSchema.parse(req.body);

        const leave = await prisma.leaveApplication.update({
            where: { id: Number(id) },
            data: {
                status: data.status,
                approvedBy: data.approvedBy,
                rejectionReason: data.rejectionReason,
            },
        });
        res.json(leave);
    } catch (error) {
        res.status(400).json({ message: "Error updating leave status", error });
    }
};

// Holiday Management
export const getHolidays = async (req: Request, res: Response) => {
    try {
        const holidays = await prisma.holiday.findMany({
            orderBy: { startDate: "asc" },
        });
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ message: "Error fetching holidays", error });
    }
};

export const createHoliday = async (req: Request, res: Response) => {
    try {
        const data = holidaySchema.parse(req.body);
        const holiday = await prisma.holiday.create({
            data: {
                title: data.title,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                description: data.description,
                type: data.type,
            },
        });
        res.status(201).json(holiday);
    } catch (error) {
        res.status(400).json({ message: "Error creating holiday", error });
    }
};

export const updateHoliday = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = holidaySchema.partial().parse(req.body);
        const holiday = await prisma.holiday.update({
            where: { id: Number(id) },
            data: {
                title: data.title,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                description: data.description,
                type: data.type,
            },
        });
        res.json(holiday);
    } catch (error) {
        res.status(400).json({ message: "Error updating holiday", error });
    }
};

export const deleteHoliday = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.holiday.delete({ where: { id: Number(id) } });
        res.json({ message: "Holiday deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting holiday", error });
    }
};
