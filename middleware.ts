import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';


export async function middleware(req: NextRequest) {
  const CookiesData = await cookies()
  const token = CookiesData.get('token');
  if (!token || token.value === '') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  try {
    console.log(token);
    // HS256 (default for jsonwebtoken sign with a string secret)
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret, { algorithms: ['HS256'] });
    console.log(payload);
    return NextResponse.next();
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(new URL('/', req.url));
  }

}
export const config = {
  matcher: ['/dashboard', '/profile', '/Welcome'],
};