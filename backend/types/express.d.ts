declare namespace Express {
  export interface User {
    id: number;
    role: string;
    email: string;
  }
  export interface Request {
    user: User;
  }
}
