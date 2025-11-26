import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utility/prisma";
import jwt from "jsonwebtoken";

export const Signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password, role } = req.body;

        if (!email || !username || !password) {
            res.status(400).json({ message: "Email, username, and password are required" });
            return;
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role: role || "STUDENT",
                status: "ACTIVE",
            },
        });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const Login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        // Find user by email or username (allowing login with admission no / username)
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username: email }],
            },
            select: { id: true, email: true, username: true, role: true, password: true, status: true },
        });

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        if (user.status !== "ACTIVE") {
            res.status(403).json({ message: "Account is disabled. Please contact admin." });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });


        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
            token, // Sending token in body as well for client-side storage if needed
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const Logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.user is populated by middleware
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, username: true, role: true, status: true },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Fetch detailed profile based on role
        let profileData = null;

        if (user.role === "STUDENT") {
            profileData = await prisma.student.findUnique({
                where: { userId: user.id },
                include: { class: true, section: true },
            });
        } else if (
            ["TEACHER", "LIBRARIAN", "DRIVER", "ACCOUNTANT", "RECEPTIONIST", "ADMIN", "SUPER_ADMIN"].includes(user.role)
        ) {
            // Fetch Staff profile for these roles
            profileData = await prisma.staff.findUnique({
                where: { userId: user.id },
                include: { department: true },
            });
        } else if (user.role === "PARENT") {
            profileData = await prisma.parent.findUnique({
                where: { userId: user.id },
                include: { students: { select: { firstName: true, lastName: true, class: true } } },
            });
        }

        res.status(200).json({
            user,
            profile: profileData,
        });
    } catch (error) {
        console.error("Get Profile error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
