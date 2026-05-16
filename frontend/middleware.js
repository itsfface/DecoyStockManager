import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  const path = request.nextUrl.pathname;

  if (!token && (path.startsWith("/dashboard") || path.startsWith("/employee-dashboard"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      const role = payload.role;
      if (path === "/") {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        if (role === "STORE MANAGER") {
          return NextResponse.redirect(new URL("/employee-dashboard", request.url));
        }
      }

      if (path.startsWith("/dashboard") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/employee-dashboard", request.url));
      }

      if (path.startsWith("/employee-dashboard") && role !== "STORE MANAGER") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

    } catch (err) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}