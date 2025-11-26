import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const examSchema = z.object({
    name: z.string().min(1),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    description: z.string().optional(),
    subjectAllocationId: z.number().optional(),
});

const scheduleSchema = z.object({
    examId: z.number(),
    classId: z.number(),
    subjectId: z.number(),
    date: z.string().or(z.date()),
    startTime: z.string(),
    endTime: z.string(),
    roomNo: z.string().optional(),
    maxMarks: z.number(),
    minMarks: z.number(),
});

const resultSchema = z.object({
    examId: z.number(),
    studentId: z.number(),
    subjectId: z.number(),
    marksObtained: z.number(),
    grade: z.string().optional(),
    remarks: z.string().optional(),
});

// Exams
export const createExam = async (req: Request, res: Response) => {
    try {
        const data = examSchema.parse(req.body);
        const exam = await prisma.exam.create({
            data: {
                name: data.name,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                description: data.description,
                subjectAllocationId: data.subjectAllocationId,
            },
        });
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: "Error creating exam", error });
    }
};

export const getExams = async (req: Request, res: Response) => {
    try {
        const exams = await prisma.exam.findMany({
            orderBy: { startDate: "desc" },
        });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exams", error });
    }
};

export const deleteExam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.exam.delete({ where: { id: Number(id) } });
        res.json({ message: "Exam deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting exam", error });
    }
};

// Schedules
export const createExamSchedule = async (req: Request, res: Response) => {
    try {
        const data = scheduleSchema.parse(req.body);
        const schedule = await prisma.examSchedule.create({
            data: {
                examId: data.examId,
                classId: data.classId,
                subjectId: data.subjectId,
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime,
                roomNo: data.roomNo,
                maxMarks: data.maxMarks,
                minMarks: data.minMarks,
            },
        });
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: "Error creating exam schedule", error });
    }
};

export const getExamSchedules = async (req: Request, res: Response) => {
    try {
        const { examId, classId } = req.query;
        const where: any = {};
        if (examId) where.examId = Number(examId);
        if (classId) where.classId = Number(classId);

        const schedules = await prisma.examSchedule.findMany({
            where,
            include: { exam: true, class: true, subject: true },
            orderBy: { date: "asc" },
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exam schedules", error });
    }
};

// Results
export const addExamResult = async (req: Request, res: Response) => {
    try {
        const data = resultSchema.parse(req.body);
        const result = await prisma.examResult.create({
            data: {
                examId: data.examId,
                studentId: data.studentId,
                subjectId: data.subjectId,
                marksObtained: data.marksObtained,
                grade: data.grade,
                remarks: data.remarks,
            },
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: "Error adding exam result", error });
    }
};

export const getExamResults = async (req: Request, res: Response) => {
    try {
        const { studentId, examId } = req.query;
        const where: any = {};
        if (studentId) where.studentId = Number(studentId);
        if (examId) where.examId = Number(examId);

        const results = await prisma.examResult.findMany({
            where,
            include: { exam: true, subject: true, student: { select: { firstName: true, lastName: true, admissionNo: true } } },
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching exam results", error });
    }
};
