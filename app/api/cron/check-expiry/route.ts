export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { processReminders } from "./reminder-processor";

export async function GET() {
  try {
    const logs = await processReminders();
    return NextResponse.json({ success: true, processedCount: logs.length, logs });
  } catch (error: any) {
    console.error("Cron Expiry Check Error:", error);
    return NextResponse.json({ error: error.message || "Cron internal error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const logs = await processReminders();
    return NextResponse.json({ success: true, processedCount: logs.length, logs });
  } catch (error: any) {
    console.error("Cron Expiry Check Error:", error);
    return NextResponse.json({ error: error.message || "Cron internal error" }, { status: 500 });
  }
}
