import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const studentAttendanceSchema = z.object({
    studentId: z.number(),
    date: z.string().or(z.date()),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY", "HOLIDAY"]),
    remark: z.string().optional(),
});

const bulkStudentAttendanceSchema = z.object({
    date: z.string().or(z.date()),
    classId: z.number(),
    sectionId: z.number(),
    students: z.array(z.object({
        studentId: z.number(),
        status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY", "HOLIDAY"]),
        remark: z.string().optional(),
    })),
});

const staffAttendanceSchema = z.object({
    staffId: z.number(),
    date: z.string().or(z.date()),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY", "HOLIDAY"]),
    checkIn: z.string().or(z.date()).optional(),
    checkOut: z.string().or(z.date()).optional(),
    remark: z.string().optional(),
});

// Student Attendance
export const markStudentAttendance = async (req: Request, res: Response) => {
    try {
        const data = studentAttendanceSchema.parse(req.body);
        const date = new Date(data.date);

        const attendance = await prisma.studentAttendance.upsert({
            where: {
                studentId_date: {
                    studentId: data.studentId,
                    date: date,
                },
            },
            update: {
                status: data.status,
                remark: data.remark,
            },
            create: {
                studentId: data.studentId,
                date: date,
                status: data.status,
                remark: data.remark,
            },
        });
        res.json(attendance);
    } catch (error) {
        res.status(400).json({ message: "Error marking student attendance", error });
    }
};

export const markBulkStudentAttendance = async (req: Request, res: Response) => {
    try {
        const data = bulkStudentAttendanceSchema.parse(req.body);
        const date = new Date(data.date);

        const results = await prisma.$transaction(
            data.students.map((student) =>
                prisma.studentAttendance.upsert({
                    where: {
                        studentId_date: {
                            studentId: student.studentId,
                            date: date,
                        },
                    },
                    update: {
                        status: student.status,
                        remark: student.remark,
                    },
                    create: {
                        studentId: student.studentId,
                        date: date,
                        status: student.status,
                        remark: student.remark,
                    },
                })
            )
        );
        res.json({ message: "Bulk attendance marked", count: results.length });
    } catch (error) {
        res.status(400).json({ message: "Error marking bulk attendance", error });
    }
};

export const getStudentAttendance = async (req: Request, res: Response) => {
    try {
        const { studentId, startDate, endDate } = req.query;

        const where: any = {};
        if (studentId) where.studentId = Number(studentId);
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string),
            };
        }

        const attendance = await prisma.studentAttendance.findMany({
            where,
            include: { student: { select: { firstName: true, lastName: true, admissionNo: true } } },
            orderBy: { date: "desc" },
        });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student attendance", error });
    }
};

// Staff Attendance
export const markStaffAttendance = async (req: Request, res: Response) => {
    try {
        const data = staffAttendanceSchema.parse(req.body);
        const date = new Date(data.date);

        const attendance = await prisma.staffAttendance.upsert({
            where: {
                staffId_date: {
                    staffId: data.staffId,
                    date: date,
                },
            },
            update: {
                status: data.status,
                checkIn: data.checkIn ? new Date(data.checkIn) : undefined,
                checkOut: data.checkOut ? new Date(data.checkOut) : undefined,
                remark: data.remark,
            },
            create: {
                staffId: data.staffId,
                date: date,
                status: data.status,
                checkIn: data.checkIn ? new Date(data.checkIn) : undefined,
                checkOut: data.checkOut ? new Date(data.checkOut) : undefined,
                remark: data.remark,
            },
        });
        res.json(attendance);
    } catch (error) {
        res.status(400).json({ message: "Error marking staff attendance", error });
    }
};

export const getStaffAttendance = async (req: Request, res: Response) => {
    try {
        const { staffId, startDate, endDate } = req.query;

        const where: any = {};
        if (staffId) where.staffId = Number(staffId);
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string),
            };
        }

        const attendance = await prisma.staffAttendance.findMany({
            where,
            include: { staff: { select: { firstName: true, lastName: true, designation: true } } },
            orderBy: { date: "desc" },
        });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff attendance", error });
    }
};
