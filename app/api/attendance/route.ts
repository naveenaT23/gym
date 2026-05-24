import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// GET: Retrieve attendance logs for a specific date
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const logs = await dbService.getAttendanceLogs(date);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Attendance GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch logs" }, { status: 500 });
  }
}

// POST: Trigger manual or QR check-in / check-out
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    // 1. Verify if member exists
    const member = await dbService.getMemberById(memberId);
    if (!member) {
      return NextResponse.json({ error: "Invalid Member ID. Member not registered." }, { status: 404 });
    }

    // 2. Check if membership plan has expired
    const today = new Date();
    today.setHours(0,0,0,0);
    const expiry = new Date(member.expiry_date);
    if (expiry < today) {
      return NextResponse.json({ 
        error: `Membership for ${member.name} has expired on ${new Date(member.expiry_date).toLocaleDateString()}. Cannot check in.` 
      }, { status: 403 });
    }

    // 3. Log Check-In or Check-Out
    const record = await dbService.logAttendance(memberId);
    
    // Attach member details to the returned response object
    const finalRecord = {
      ...record,
      name: member.name,
      phone: member.phone,
    };

    return NextResponse.json({ success: true, record: finalRecord });
  } catch (error: any) {
    console.error("Attendance POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to log attendance" }, { status: 500 });
  }
}
