import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
      res.status(401).json({
        message: "Not authorized, token failed",
        success: false,
      });
      return;
    }
    const decode = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as JwtPayload;

    if (!decode) {
      res.status(401).json({
        message: "Invalid token",
        success: false,
      });
      return;
    }

    req.user = {
      id: decode.userId,
      email: decode.email,
      role: decode.role,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({
      message: "Not authorized, token failed",
      success: false,
    });
  }
};

// Middleware to restrict access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
      return;
    }

    next();
  };
};
