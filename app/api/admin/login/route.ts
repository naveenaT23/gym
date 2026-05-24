import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth";

// Simple In-memory Login Rate Limiter
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // Allow max 5 attempts

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();

    // Check rate limit status
    const clientLimit = loginAttempts.get(ip);
    if (clientLimit && now < clientLimit.resetTime && clientLimit.count >= MAX_ATTEMPTS) {
      const waitMinutes = Math.ceil((clientLimit.resetTime - now) / 60000);
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${waitMinutes} minutes.` },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Retrieve admin details using dbService
    const admin = await dbService.getAdminByEmail(email);
    if (!admin) {
      const currentLimit = loginAttempts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
      currentLimit.count += 1;
      loginAttempts.set(ip, currentLimit);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify Password Hash
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      const currentLimit = loginAttempts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
      currentLimit.count += 1;
      loginAttempts.set(ip, currentLimit);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Success: reset rate limit attempts
    loginAttempts.delete(ip);

    // Sign Session JWT
    const token = await signJWT({
      id: admin.id.toString(),
      email: admin.email,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });

    // Set HTTP-Only Cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
