export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

async function processReminders() {
  const settings = await dbService.getSettings();
  const templates = settings.whatsapp_templates || {
    "7_days_before": "Hello {{customer_name}}, your gym membership plan will expire in 7 days on {{expiry_date}}. Kindly renew your membership to continue your fitness journey. Contact us for renewal. Thank you!",
    "3_days_before": "Hello {{customer_name}}, your gym membership plan will expire in 3 days on {{expiry_date}}. Kindly renew your membership to continue your fitness journey. Contact us for renewal. Thank you!",
    "on_expiry": "Hello {{customer_name}}, your gym membership plan expires today on {{expiry_date}}. Kindly renew your membership to continue your fitness journey. Contact us for renewal. Thank you!",
    "after_expiry": "Hello {{customer_name}}, your gym membership plan expired on {{expiry_date}}. Kindly renew your membership to continue your fitness journey. Contact us for renewal. Thank you!",
  };

  const pabblyUrl = settings.pabblyWebhookUrl;

  // Calculate target dates in string format YYYY-MM-DD
  const today = new Date();
  
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const dates = {
    "7_days_before": formatDate(new Date(new Date().setDate(today.getDate() + 7))),
    "3_days_before": formatDate(new Date(new Date().setDate(today.getDate() + 3))),
    "on_expiry": formatDate(today),
    "after_expiry": formatDate(new Date(new Date().setDate(today.getDate() - 3))),
  };

  const allMembers = await dbService.getMembers();
  const allLogs = await dbService.getNotificationLogs();
  
  const processedLogs: any[] = [];

  for (const [type, targetDateStr] of Object.entries(dates)) {
    // Filter members whose expiry date matches the target date
    const targetMembers = allMembers.filter((m) => m.expiry_date === targetDateStr);

    for (const member of targetMembers) {
      // Avoid duplicate notifications for the same member, same message type, and same expiry date
      const alreadySent = allLogs.some(
        (log) =>
          log.member_id === member.id &&
          log.message_type === type &&
          log.sent_status === "Sent" &&
          new Date(log.sent_at).toISOString().split("T")[0] === formatDate(today)
      );

      if (alreadySent) {
        continue; // Skip
      }

      const formattedExpiry = new Date(member.expiry_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      let msg = (templates as any)[type] || "";
      msg = msg
        .replace(/{{customer_name}}/g, member.name)
        .replace(/{{expiry_date}}/g, formattedExpiry)
        .replace(/{{plan_name}}/g, member.membership_plan);

      // Default to Failed if webhook is missing
      if (!pabblyUrl) {
        await dbService.logNotification({
          member_id: member.id,
          message_type: type,
          sent_status: "Failed",
          error_message: "Pabbly Webhook URL not configured in Settings",
        });
        processedLogs.push({ customerName: member.name, type, status: "Failed", error: "No URL config" });
        continue;
      }

      try {
        // Send webhook notification to Pabbly Connect
        const res = await fetch(pabblyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "expiry_reminder",
            type,
            customerId: member.id,
            customerName: member.name,
            mobileNumber: member.phone,
            whatsAppNumber: member.whatsapp_number,
            planName: member.membership_plan,
            expiryDate: member.expiry_date,
            formattedExpiryDate: formattedExpiry,
            message: msg,
          }),
        });

        if (res.ok) {
          await dbService.logNotification({
            member_id: member.id,
            message_type: type,
            sent_status: "Sent",
          });
          processedLogs.push({ customerName: member.name, type, status: "Sent" });
        } else {
          const errText = await res.text();
          const errorMsg = `Pabbly webhook returned ${res.status}: ${errText}`;
          await dbService.logNotification({
            member_id: member.id,
            message_type: type,
            sent_status: "Failed",
            error_message: errorMsg,
          });
          processedLogs.push({ customerName: member.name, type, status: "Failed", error: errorMsg });
        }
      } catch (err: any) {
        const errorMsg = err.message || "Network connection failed";
        await dbService.logNotification({
          member_id: member.id,
          message_type: type,
          sent_status: "Failed",
          error_message: errorMsg,
        });
        processedLogs.push({ customerName: member.name, type, status: "Failed", error: errorMsg });
      }
    }
  }

  return processedLogs;
}

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
