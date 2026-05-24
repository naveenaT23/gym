import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { dbService } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await dbService.getAdminByEmail(payload.email);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    const finalName = name || admin.name;
    const finalEmail = email || admin.email;

    // Check if email changed and is in use by another admin
    if (email && email !== admin.email) {
      const emailUsed = await dbService.getAdminByEmail(email);
      if (emailUsed && emailUsed.id !== admin.id) {
        return NextResponse.json({ error: "Email is already in use by another admin" }, { status: 400 });
      }
    }

    let newPasswordHash = undefined;

    // Password Update logic
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!isMatch) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      newPasswordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await dbService.updateAdminProfile(admin.id, finalName, finalEmail, newPasswordHash);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: updated.name,
        email: updated.email,
        role: "admin",
      },
    });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
