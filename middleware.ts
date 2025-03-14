import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const isAuthPage = request.nextUrl.pathname === "/";

  // Always verify token validity
  const isValidToken = authToken ? await verifyToken(authToken.value) : false;

  // Handle authentication paths
  if (!isValidToken && !isAuthPage) {
    // No valid token and not on auth page - redirect to login
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isValidToken && isAuthPage) {
    // Valid token but on auth page - redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};