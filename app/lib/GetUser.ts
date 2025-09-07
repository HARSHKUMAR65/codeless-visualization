import { prisma } from "@/app/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const getTokenandReturnUser = async (token: string) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & { email?: string };
    if (!payload?.email) {
      throw new Error("Invalid token payload: missing email");
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    return user;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

export default getTokenandReturnUser;
