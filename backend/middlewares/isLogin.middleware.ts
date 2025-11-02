import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

export const isLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("middleware auth req.cookies", req);
    const token = req.cookies.token;
    console.log("middleware auth token", token);
    if (!token) {
      console.log("middleware auth token line 12", token);
      res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
      return;
    }
    console.log("middleware auth token line 14", token);
    const decode = await jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decode) {
      res.status(401).json({
        message: "Invalid token",
        success: false,
      });
      return;
    }

    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};
