import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const schoolProfileSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    website: z.string().optional(),
    logo: z.string().optional(),
    currency: z.string().default("USD"),
    language: z.string().default("en"),
    timezone: z.string().default("UTC"),
    academicYear: z.string().min(1),
});

const academicYearSchema = z.object({
    name: z.string().min(1),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    isCurrent: z.boolean().optional(),
});

const sessionSchema = z.object({
    name: z.string().min(1),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    academicYearId: z.number(),
});

// School Profile
export const createSchoolProfile = async (req: Request, res: Response) => {
    try {
        const data = schoolProfileSchema.parse(req.body);
        const existing = await prisma.schoolProfile.findFirst();

        if (existing) {
            return res.status(400).json({ message: "School profile already exists. Use update instead." });
        }

        const created = await prisma.schoolProfile.create({
            data,
        });
        res.json(created);
    } catch (error) {
        res.status(400).json({ message: "Error creating school profile", error });
    }
};

export const getSchoolProfile = async (req: Request, res: Response) => {
    try {
        const profile = await prisma.schoolProfile.findFirst();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: "Error fetching school profile", error });
    }
};

export const updateSchoolProfile = async (req: Request, res: Response) => {
    try {
        const data = schoolProfileSchema.parse(req.body);
        const existing = await prisma.schoolProfile.findFirst();

        if (existing) {
            const updated = await prisma.schoolProfile.update({
                where: { id: existing.id },
                data,
            });
            res.json(updated);
        } else {
            const created = await prisma.schoolProfile.create({
                data,
            });
            res.json(created);
        }
    } catch (error) {
        res.status(400).json({ message: "Error updating school profile", error });
    }
};

// Academic Year
export const getAcademicYears = async (req: Request, res: Response) => {
    try {
        const years = await prisma.academicYear.findMany({
            orderBy: { startDate: "desc" },
            include: { sessions: true },
        });
        res.json(years);
    } catch (error) {
        res.status(500).json({ message: "Error fetching academic years", error });
    }
};

export const createAcademicYear = async (req: Request, res: Response) => {
    try {
        const { name, startDate, endDate, isCurrent } = academicYearSchema.parse(req.body);

        if (isCurrent) {
            // Unset other current years
            await prisma.academicYear.updateMany({
                where: { isCurrent: true },
                data: { isCurrent: false },
            });
        }

        const year = await prisma.academicYear.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isCurrent: isCurrent || false,
            },
        });
        res.json(year);
    } catch (error) {
        res.status(400).json({ message: "Error creating academic year", error });
    }
};

export const updateAcademicYear = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, startDate, endDate, isCurrent } = academicYearSchema.parse(req.body);

        if (isCurrent) {
            await prisma.academicYear.updateMany({
                where: { isCurrent: true, id: { not: Number(id) } },
                data: { isCurrent: false },
            });
        }

        const year = await prisma.academicYear.update({
            where: { id: Number(id) },
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isCurrent,
            },
        });
        res.json(year);
    } catch (error) {
        res.status(400).json({ message: "Error updating academic year", error });
    }
};

export const deleteAcademicYear = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.academicYear.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Academic year deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting academic year", error });
    }
};

// Sessions
export const getSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await prisma.session.findMany({
            include: { academicYear: true },
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sessions", error });
    }
};

export const createSession = async (req: Request, res: Response) => {
    try {
        const { name, startDate, endDate, academicYearId } = sessionSchema.parse(req.body);

        const session = await prisma.session.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                academicYearId,
            },
        });
        res.json(session);
    } catch (error) {
        res.status(400).json({ message: "Error creating session", error });
    }
};

export const updateSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, startDate, endDate, academicYearId } = sessionSchema.parse(req.body);

        const session = await prisma.session.update({
            where: { id: Number(id) },
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                academicYearId,
            },
        });
        res.json(session);
    } catch (error) {
        res.status(400).json({ message: "Error updating session", error });
    }
};

export const deleteSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.session.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Session deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting session", error });
    }
};
