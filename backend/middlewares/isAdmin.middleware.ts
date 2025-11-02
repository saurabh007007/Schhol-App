import { type Request, type Response, type NextFunction } from "express";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};

export default isAdmin;
