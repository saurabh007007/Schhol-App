import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import type { Login } from "../types/Admin.types";
import prisma from "../utility/prisma";

export const Signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phoneNumber, password }: Login = req.body;

    // Validate input fields
    if (!name || !email || !phoneNumber || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if user already exists (by email OR phoneNumber)
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (userExists) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
