import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 2. Define routes
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");
  const isApiAuthRoute =
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/cron/check-expiry"); // Allow login and cron endpoints without cookie auth

  // Check /admin page routes and /api routes
  if (isAdminRoute || (isApiRoute && !isApiAuthRoute)) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      if (isApiRoute) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!isLoginPage) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } else {
      const verified = await verifyJWT(token);
      if (!verified) {
        if (isApiRoute) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!isLoginPage) {
          const response = NextResponse.redirect(new URL("/admin/login", request.url));
          response.cookies.delete("admin_token");
          return response;
        }
      } else {
        if (isLoginPage) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
