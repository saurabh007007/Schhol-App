import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";

// Schemas
const feeGroupSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

const feeTypeSchema = z.object({
    name: z.string().min(1),
    feeGroupId: z.number(),
    description: z.string().optional(),
});

const feeStructureSchema = z.object({
    feeTypeId: z.number(),
    classId: z.number(),
    amount: z.number(),
    academicYearId: z.number(),
    dueDate: z.string().or(z.date()),
});

const feePaymentSchema = z.object({
    studentFeeId: z.number(),
    amount: z.number(),
    method: z.enum(["CASH", "CHEQUE", "ONLINE", "BANK_TRANSFER"]),
    transactionId: z.string().optional(),
    remarks: z.string().optional(),
});

const expenseSchema = z.object({
    title: z.string().min(1),
    amount: z.number(),
    date: z.string().or(z.date()),
    category: z.string().optional(),
    description: z.string().optional(),
});

// Fee Group
export const createFeeGroup = async (req: Request, res: Response) => {
    try {
        const data = feeGroupSchema.parse(req.body);
        const group = await prisma.feeGroup.create({ data });
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ message: "Error creating fee group", error });
    }
};

export const getFeeGroups = async (req: Request, res: Response) => {
    try {
        const groups = await prisma.feeGroup.findMany({ include: { types: true } });
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fee groups", error });
    }
};

// Fee Type
export const createFeeType = async (req: Request, res: Response) => {
    try {
        const data = feeTypeSchema.parse(req.body);
        const type = await prisma.feeType.create({ data });
        res.status(201).json(type);
    } catch (error) {
        res.status(400).json({ message: "Error creating fee type", error });
    }
};

export const getFeeTypes = async (req: Request, res: Response) => {
    try {
        const types = await prisma.feeType.findMany({ include: { feeGroup: true } });
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fee types", error });
    }
};

// Fee Structure
export const createFeeStructure = async (req: Request, res: Response) => {
    try {
        const data = feeStructureSchema.parse(req.body);
        const structure = await prisma.feeStructure.create({
            data: {
                feeTypeId: data.feeTypeId,
                classId: data.classId,
                amount: data.amount,
                dueDate: new Date(data.dueDate),
            },
        });
        res.status(201).json(structure);
    } catch (error) {
        res.status(400).json({ message: "Error creating fee structure", error });
    }
};

export const getFeeStructures = async (req: Request, res: Response) => {
    try {
        const { classId } = req.query;
        const where: any = {};
        if (classId) where.classId = Number(classId);

        const structures = await prisma.feeStructure.findMany({
            where,
            include: { feeType: true, class: true },
        });
        res.json(structures);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fee structures", error });
    }
};

// Student Fees (Assignment & Payment)
export const assignFeesToStudent = async (req: Request, res: Response) => {
    try {
        const { studentId, feeStructureIds } = req.body; // Array of IDs

        // Fetch structures to get amount and dueDate
        const structures = await prisma.feeStructure.findMany({
            where: { id: { in: feeStructureIds } },
        });

        const assignments = await prisma.$transaction(
            structures.map((structure) =>
                prisma.studentFee.create({
                    data: {
                        studentId: Number(studentId),
                        feeStructureId: structure.id,
                        amount: structure.amount,
                        dueDate: structure.dueDate || new Date(), // Fallback if null
                        status: "PENDING",
                    },
                })
            )
        );
        res.json({ message: "Fees assigned", count: assignments.length });
    } catch (error) {
        res.status(400).json({ message: "Error assigning fees", error });
    }
};

export const getStudentFees = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const fees = await prisma.studentFee.findMany({
            where: { studentId: Number(studentId) },
            include: {
                feeStructure: { include: { feeType: true } },
                payments: true,
            },
        });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student fees", error });
    }
};

export const collectFeePayment = async (req: Request, res: Response) => {
    try {
        const data = feePaymentSchema.parse(req.body);

        const payment = await prisma.$transaction(async (tx) => {
            // Create payment
            const newPayment = await tx.feePayment.create({
                data: {
                    studentFeeId: data.studentFeeId,
                    amount: data.amount,
                    method: data.method,
                    transactionId: data.transactionId,
                    remarks: data.remarks,
                },
            });

            // Update StudentFee status
            const studentFee = await tx.studentFee.findUnique({
                where: { id: data.studentFeeId },
                include: { feeStructure: true, payments: true },
            });

            if (studentFee) {
                const totalPaid = studentFee.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount;
                let status = studentFee.status;
                if (totalPaid >= studentFee.amount) {
                    status = "PAID";
                } else if (totalPaid > 0) {
                    status = "PARTIAL";
                }

                await tx.studentFee.update({
                    where: { id: data.studentFeeId },
                    data: { status: status as any, paidAmount: totalPaid },
                });
            }

            return newPayment;
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: "Error collecting payment", error });
    }
};

// Expenses
export const createExpense = async (req: Request, res: Response) => {
    try {
        const data = expenseSchema.parse(req.body);
        const expense = await prisma.expense.create({
            data: {
                title: data.title,
                amount: data.amount,
                date: new Date(data.date),
                category: data.category,
                description: data.description,
            },
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: "Error creating expense", error });
    }
};

export const getExpenses = async (req: Request, res: Response) => {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { date: "desc" },
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching expenses", error });
    }
};
