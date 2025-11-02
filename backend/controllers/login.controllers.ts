import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utility/prisma";
import { type LoginType } from "../types/Admin.types";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums";

export const Signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phoneNumber, password }: LoginType = req.body;

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
        roles: Role.ADMIN,
      },
    });
    const token = jwt.sign(
      { userId: newUser.id, roles: newUser.roles },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
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

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, roles: user.roles },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
