export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// GET: Retrieve WhatsApp notification log history
export async function GET() {
  try {
    const logsRaw = await dbService.getNotificationLogs();

    // Map database properties back to camelCase for the frontend UI templates
    const logs = logsRaw.map((log: any) => ({
      _id: log.id,
      customerName: log.members?.name || "Unknown",
      mobile: log.members?.phone || "N/A",
      messageType: log.message_type,
      sentStatus: log.sent_status,
      errorMessage: log.error_message || "",
      sentAt: log.sent_at,
    }));

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Fetch Notification Logs Error:", error);
    return NextResponse.json({ error: "Failed to fetch notification logs" }, { status: 500 });
  }
}
