import { UserRole } from "@prisma/client"; // if you have roles in Prisma

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string; // or UserRole
      };
    }
  }
}
