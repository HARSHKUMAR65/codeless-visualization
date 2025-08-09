import jwt from "jsonwebtoken";
export function verifyToken(token?: string) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string; email: string; role?: "user" | "admin";
    };
  } catch {
    return null;
  }
}
