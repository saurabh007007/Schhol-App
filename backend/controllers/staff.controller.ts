import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Schemas
const staffSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    dateOfBirth: z.string().or(z.date()),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    qualification: z.string().optional(),
    experience: z.string().optional(),
    address: z.string().optional(),
    joiningDate: z.string().or(z.date()),
    designation: z.string().min(1),
    departmentId: z.number().optional(),
    salary: z.number().optional(),
    password: z.string().min(6).optional(), // Optional, default generated
    role: z.enum(["TEACHER", "ADMIN", "LIBRARIAN", "DRIVER", "ACCOUNTANT", "RECEPTIONIST"]).default("TEACHER"),
});

const departmentSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    headId: z.number().optional(),
});

// Staff Management
export const getAllStaff = async (req: Request, res: Response) => {
    try {
        const staff = await prisma.staff.findMany({
            include: {
                user: { select: { email: true, phone: true, role: true, status: true } },
                department: true,
            },
        });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff", error });
    }
};

export const getStaffById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const staff = await prisma.staff.findUnique({
            where: { id: Number(id) },
            include: {
                user: true,
                department: true,
                classes: true,
                subjects: true,
            },
        });
        if (!staff) return res.status(404).json({ message: "Staff not found" });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff details", error });
    }
};

export const createStaff = async (req: Request, res: Response) => {
    try {
        const data = staffSchema.parse(req.body);

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { phone: data.phone }] },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User with email or phone already exists" });
        }

        const hashedPassword = await bcrypt.hash(data.password || "password123", 10);
        const username = data.email!.split("@")[0] + Math.floor(Math.random() * 1000);

        // Transaction to create User and Staff
        const newStaff = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username,
                    email: data.email,
                    phone: data.phone,
                    password: hashedPassword,
                    role: data.role as any, // Cast to Role enum
                    status: "ACTIVE",
                },
            });

            const staff = await tx.staff.create({
                data: {
                    userId: user.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dateOfBirth: new Date(data.dateOfBirth),
                    gender: data.gender,
                    qualification: data.qualification,
                    experience: data.experience,
                    address: data.address,
                    joiningDate: new Date(data.joiningDate),
                    designation: data.designation,
                    departmentId: data.departmentId,
                    salary: data.salary,
                },
            });

            return staff;
        });

        res.status(201).json(newStaff);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error creating staff", error });
    }
};

export const updateStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = staffSchema.partial().parse(req.body);

        const staff = await prisma.staff.update({
            where: { id: Number(id) },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                gender: data.gender,
                qualification: data.qualification,
                experience: data.experience,
                address: data.address,
                joiningDate: data.joiningDate ? new Date(data.joiningDate) : undefined,
                designation: data.designation,
                departmentId: data.departmentId,
                salary: data.salary,
            },
        });

        // Update User if email/phone changed
        if (data.email || data.phone || data.role) {
            await prisma.user.update({
                where: { id: staff.userId },
                data: {
                    email: data.email,
                    phone: data.phone,
                    role: data.role as any,
                },
            });
        }

        res.json(staff);
    } catch (error) {
        res.status(400).json({ message: "Error updating staff", error });
    }
};

export const deleteStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const staff = await prisma.staff.findUnique({ where: { id: Number(id) } });
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        // Delete User (Cascade will delete Staff)
        await prisma.user.delete({
            where: { id: staff.userId },
        });

        res.json({ message: "Staff and User account deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting staff", error });
    }
};

// Department Management
export const getDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await prisma.department.findMany({
            include: { _count: { select: { staff: true } } },
        });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error });
    }
};

export const createDepartment = async (req: Request, res: Response) => {
    try {
        const data = departmentSchema.parse(req.body);
        const department = await prisma.department.create({ data });
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: "Error creating department", error });
    }
};

export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = departmentSchema.parse(req.body);
        const department = await prisma.department.update({
            where: { id: Number(id) },
            data,
        });
        res.json(department);
    } catch (error) {
        res.status(400).json({ message: "Error updating department", error });
    }
};

export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.department.delete({ where: { id: Number(id) } });
        res.json({ message: "Department deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting department", error });
    }
};
