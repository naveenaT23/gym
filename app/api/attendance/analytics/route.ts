import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET() {
  try {
    const rawCounts = await dbService.getMonthlyAttendanceAnalytics();

    // Map last 30 days dates to daily counts
    const analytics = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

      analytics.push({
        name: label,
        date: dateStr,
        count: rawCounts[dateStr] || 0,
      });
    }

    return NextResponse.json({ success: true, analytics });
  } catch (error: any) {
    console.error("Attendance Analytics API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
