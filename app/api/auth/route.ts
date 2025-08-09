import { prisma } from '@/app/lib/prisma';
import { apiError, apiResponse } from '@/app/lib/ApiResponse';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
const RegisterSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email'),
  password: z.string().nonempty('Password is required').min(6, 'Password must be at least 6 characters'),
  name: z.string().nonempty('Name is required'),
  role: z.string().nonempty('Role is required').refine(val => ['user', 'admin'].includes(val), {
    message: 'Role must be either "user" or "admin"'
  })
});
const generateToken = (email: string, role: string): string => {
  const token = jwt.sign({ email, role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  return token;
};
const verifyToken = (token: string): { email: string; role: string } => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string; role: string };
  return decoded;
};
export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return apiError('Unauthorized', 401);
  }
  const decoded = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { email: decoded.email } });
  if (!user) {
    return apiError('User not found', 404);
  }
  return apiResponse(user);
}
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return apiError('Invalid JSON format. Make sure you use double quotes.', 400);
  }
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    const formattedErrors = parsed.error.format();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return apiError(formattedErrors, 400);
  }

  const { email, password, name, role } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return apiError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    return apiResponse({ user: newUser }, 'User created successfully', 201);
  } catch (err: unknown) {
    console.error('Error in register route:', err);
    return apiError('Something went wrong on the server', 500);
  }
}



export async function PUT(request: Request) {
  let body: { email: string; password: string };
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON format", 400);
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      return apiError("User not found", 404);
    }
    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) {
      return apiError("Invalid password", 401);
    }
    const token = generateToken(user.email, user.role);
    const userWithoutPassword = {
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict; Secure`;
    return new Response(
      JSON.stringify({
        user: userWithoutPassword,
        message: "User logged in successfully",
        status: 200,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch {
    return apiError("Internal server error", 500);
  }
}















export async function DELETE(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return apiError('Unauthorized', 401);
  }
  const decoded = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { email: decoded.email } });
  if (!user) {
    return apiError('User not found', 404);
  }
  await prisma.user.delete({ where: { email: user.email } });
  return apiResponse({}, 'User deleted successfully', 200);
}