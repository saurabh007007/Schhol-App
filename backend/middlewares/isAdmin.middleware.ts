import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utility/prisma";

interface JwtPayload {
  userId: string;
  roles: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        roles: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Fetch the user from database (optional but safer)
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId), email: decoded.roles },
    });

    if (!user) {
      res.status(401).json({ message: "User not found or invalid token" });
      return;
    }

    // Attach user to request
    req.user = { id: user.id, roles: user.roles };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
