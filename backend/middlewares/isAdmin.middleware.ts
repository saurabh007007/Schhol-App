import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roles, email } = req.user as {
      userId: string;
      email: string;
      roles: string;
    };
    if (roles === "ADMIN") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
