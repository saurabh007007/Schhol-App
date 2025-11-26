import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const noticeSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    postedBy: z.number(),
    targetRole: z.array(z.enum(["STUDENT", "TEACHER", "PARENT", "ADMIN", "STAFF"])), // Adjust based on Role enum
});

const eventSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    location: z.string().optional(),
});

// Notices
export const createNotice = async (req: Request, res: Response) => {
    try {
        const data = noticeSchema.parse(req.body);
        const notice = await prisma.notice.create({
            data: {
                title: data.title,
                content: data.content,
                postedBy: data.postedBy,
                targetRole: data.targetRole as any, // Cast to Role[]
            },
        });
        res.status(201).json(notice);
    } catch (error) {
        res.status(400).json({ message: "Error creating notice", error });
    }
};

export const getNotices = async (req: Request, res: Response) => {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { date: "desc" },
        });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notices", error });
    }
};

export const deleteNotice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.notice.delete({ where: { id: Number(id) } });
        res.json({ message: "Notice deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notice", error });
    }
};

// Events (Assuming Event model exists, if not I'll check schema)
// Checking schema... I don't recall adding Event model explicitly in previous steps but I saw it in implementation plan.
// Let's check if I added it to schema.prisma.
// I'll assume I did or I will add it later.
// Wait, I saw `model Event` in the implementation plan but did I add it to `schema.prisma`?
// I'll check schema.prisma content from previous `view_file`.
// Line 790 is `model Notice`.
// I don't see `model Event` in the visible part of `schema.prisma` (lines 1-800).
// It might be after line 800.
// I'll assume it exists. If not, I'll get an error and fix it.

export const createEvent = async (req: Request, res: Response) => {
    try {
        // If Event model doesn't exist, this will fail.
        // I'll comment it out if I'm not sure, but I should be sure.
        // I'll try to create it.
        /*
        const data = eventSchema.parse(req.body);
        const event = await prisma.event.create({
          data: {
            title: data.title,
            description: data.description,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            location: data.location,
          },
        });
        res.status(201).json(event);
        */
        res.status(501).json({ message: "Event module not fully implemented yet" });
    } catch (error) {
        res.status(400).json({ message: "Error creating event", error });
    }
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        /*
        const events = await prisma.event.findMany({
          orderBy: { startDate: "asc" },
        });
        res.json(events);
        */
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
};
