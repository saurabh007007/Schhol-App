export interface JwtPayload {
  userId: string;
  email: string;
  roles: string;
}
export interface JwtRequest extends Request {
  user?: JwtPayload;
}
