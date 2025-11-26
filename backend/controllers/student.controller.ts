import type { Request, Response } from "express";
import prisma from "../utility/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Schemas
const parentSchema = z.object({
    fatherName: z.string().min(1),
    motherName: z.string().min(1),
    guardianName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().min(10),
    occupation: z.string().optional(),
    income: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(6).optional(),
});

const studentSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string().or(z.date()),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    bloodGroup: z.enum(["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"]).optional(),
    religion: z.enum(["HINDU", "MUSLIM", "CHRISTIAN", "SIKH", "BUDDHIST", "JAIN", "OTHER"]).optional(),
    category: z.string().optional(),
    classId: z.number(),
    sectionId: z.number(),
    academicYearId: z.number(),
    admissionNo: z.string().min(1),
    rollNumber: z.string().optional(),
    email: z.string().email().optional(), // Student email
    phone: z.string().optional(), // Student phone
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    password: z.string().min(6).optional(),

    // Parent details (can be existing ID or new details)
    parentId: z.number().optional(),
    parentDetails: parentSchema.optional(),
});

// Student Management
export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                user: { select: { email: true, phone: true, status: true } },
                class: true,
                section: true,
                parent: true,
            },
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
    }
};

export const getStudentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const student = await prisma.student.findUnique({
            where: { id: Number(id) },
            include: {
                user: true,
                class: true,
                section: true,
                parent: true,
                attendance: { take: 10, orderBy: { date: "desc" } },
                marks: { include: { exam: true, subject: true } },
                fees: { include: { feeStructure: { include: { feeType: true } } } },
            },
        });
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student details", error });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    try {
        const data = studentSchema.parse(req.body);

        // Check if admission no exists
        const existingStudent = await prisma.student.findUnique({
            where: { admissionNo: data.admissionNo },
        });
        if (existingStudent) {
            return res.status(400).json({ message: "Admission number already exists" });
        }

        // Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Handle Parent
            let parentId = data.parentId;

            if (!parentId && data.parentDetails) {
                // Check if parent user exists
                const existingParentUser = await tx.user.findFirst({
                    where: { OR: [{ email: data.parentDetails.email }, { phone: data.parentDetails.phone }] },
                });

                if (existingParentUser) {
                    // Check if parent record exists for this user
                    const existingParent = await tx.parent.findUnique({ where: { userId: existingParentUser.id } });
                    if (existingParent) {
                        parentId = existingParent.id;
                    } else {
                        // Create parent record for existing user (rare case)
                        const newParent = await tx.parent.create({
                            data: {
                                userId: existingParentUser.id,
                                fatherName: data.parentDetails.fatherName,
                                motherName: data.parentDetails.motherName,
                                guardianName: data.parentDetails.guardianName,
                                occupation: data.parentDetails.occupation,
                                income: data.parentDetails.income,
                                address: data.parentDetails.address,
                            },
                        });
                        parentId = newParent.id;
                    }
                } else {
                    // Create new Parent User and Parent
                    const parentPassword = await bcrypt.hash(data.parentDetails.password || "parent123", 10);
                    const parentUsername = data.parentDetails!.email.split("@")[0] + Math.floor(Math.random() * 1000);

                    const parentUser = await tx.user.create({
                        data: {
                            username: parentUsername,
                            email: data.parentDetails.email,
                            phone: data.parentDetails.phone,
                            password: parentPassword,
                            role: "PARENT",
                            status: "ACTIVE",
                        },
                    });

                    const newParent = await tx.parent.create({
                        data: {
                            userId: parentUser.id,
                            fatherName: data.parentDetails.fatherName,
                            motherName: data.parentDetails.motherName,
                            guardianName: data.parentDetails.guardianName,
                            occupation: data.parentDetails.occupation,
                            income: data.parentDetails.income,
                            address: data.parentDetails.address,
                        },
                    });
                    parentId = newParent.id;
                }
            }

            // 2. Create Student User
            // Student email/phone might be optional or same as parent (not recommended for auth)
            // If no email/phone provided, generate username only
            const studentUsername = data.admissionNo; // Use admission no as username
            const studentPassword = await bcrypt.hash(data.password || "student123", 10);

            let studentUser;
            // Check if user exists (if email/phone provided)
            if (data.email || data.phone) {
                const existingUser = await tx.user.findFirst({
                    where: {
                        OR: [
                            ...(data.email ? [{ email: data.email }] : []),
                            ...(data.phone ? [{ phone: data.phone }] : [])
                        ]
                    }
                });
                if (existingUser) throw new Error("Student email or phone already registered");

                studentUser = await tx.user.create({
                    data: {
                        username: studentUsername,
                        email: data.email,
                        phone: data.phone,
                        password: studentPassword,
                        role: "STUDENT",
                        status: "ACTIVE",
                    }
                });
            } else {
                studentUser = await tx.user.create({
                    data: {
                        username: studentUsername,
                        password: studentPassword,
                        role: "STUDENT",
                        status: "ACTIVE",
                    }
                });
            }

            // 3. Create Student
            const newStudent = await tx.student.create({
                data: {
                    userId: studentUser.id,
                    admissionNo: data.admissionNo,
                    rollNumber: data.rollNumber,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dateOfBirth: new Date(data.dateOfBirth),
                    gender: data.gender,
                    bloodGroup: data.bloodGroup,
                    religion: data.religion,
                    category: data.category,
                    classId: data.classId,
                    sectionId: data.sectionId,
                    academicYearId: data.academicYearId,
                    parentId: parentId,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    country: data.country,
                }
            });

            return newStudent;
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message || "Error creating student", error });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = studentSchema.partial().parse(req.body);

        const student = await prisma.student.update({
            where: { id: Number(id) },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                gender: data.gender,
                bloodGroup: data.bloodGroup,
                religion: data.religion,
                category: data.category,
                classId: data.classId,
                sectionId: data.sectionId,
                academicYearId: data.academicYearId,
                admissionNo: data.admissionNo,
                rollNumber: data.rollNumber,
                parentId: data.parentId,
                address: data.address,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                country: data.country,
            },
        });

        // Update User if email/phone changed
        if (data.email || data.phone) {
            await prisma.user.update({
                where: { id: student.userId },
                data: {
                    email: data.email,
                    phone: data.phone,
                }
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: "Error updating student", error });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const student = await prisma.student.findUnique({ where: { id: Number(id) } });
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Delete User (Cascade will delete Student)
        await prisma.user.delete({
            where: { id: student.userId },
        });

        res.json({ message: "Student and User account deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error });
    }
};

// Parent Management
export const getAllParents = async (req: Request, res: Response) => {
    try {
        const parents = await prisma.parent.findMany({
            include: {
                user: { select: { email: true, phone: true } },
                students: { select: { firstName: true, lastName: true, class: true } }
            }
        });
        res.json(parents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching parents", error });
    }
};

export const getParentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const parent = await prisma.parent.findUnique({
            where: { id: Number(id) },
            include: {
                user: true,
                students: { include: { class: true, section: true } }
            }
        });
        if (!parent) return res.status(404).json({ message: "Parent not found" });
        res.json(parent);
    } catch (error) {
        res.status(500).json({ message: "Error fetching parent details", error });
    }
};

export const updateParent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = parentSchema.partial().parse(req.body);

        const parent = await prisma.parent.update({
            where: { id: Number(id) },
            data: {
                fatherName: data.fatherName,
                motherName: data.motherName,
                guardianName: data.guardianName,
                occupation: data.occupation,
                income: data.income,
                address: data.address,
            }
        });

        if (data.email || data.phone) {
            await prisma.user.update({
                where: { id: parent.userId },
                data: {
                    email: data.email,
                    phone: data.phone,
                }
            });
        }

        res.json(parent);
    } catch (error) {
        res.status(400).json({ message: "Error updating parent", error });
    }
};
