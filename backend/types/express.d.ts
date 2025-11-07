declare namespace Express {
  export interface User {
    id: number;
    roles: "ADMIN" | "USER" | string;
    email?: string;
    // add other fields your auth sets here
  }
  export interface Request {
    user?: User;
  }
}
