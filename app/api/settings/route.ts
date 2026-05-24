export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// GET: Retrieve all system configuration settings
export async function GET() {
  try {
    const settings = await dbService.getSettings();
    
    // Map keys to match the frontend settings format
    const settingsObj = {
      pabbly_webhook_url: settings.pabblyWebhookUrl,
      whatsapp_templates: {
        "7_days_before": settings.whatsapp_templates?.["7_days_before"] || "Hello {{customer_name}}, your gym membership plan will expire in 7 days on {{expiry_date}}. Kindly renew your membership to continue your fitness journey. Contact us for renewal. Thank you!",
        "3_days_before": settings.whatsapp_templates?.["3_days_before"] || "Hello {{customer_name}}, your gym membership plan will expire in 3 days on {{expiry_date}}. Kindly renew your membership to continue your fitness journey. Contact us for renewal. Thank you!",
        "on_expiry": settings.whatsapp_templates?.["on_expiry"] || "Hello {{customer_name}}, your gym membership plan expires today on {{expiry_date}}. Kindly renew your membership to continue your fitness journey. Contact us for renewal. Thank you!",
        "after_expiry": settings.whatsapp_templates?.["after_expiry"] || "Hello {{customer_name}}, your gym membership plan expired on {{expiry_date}}. Kindly renew your membership to continue your fitness journey. Contact us for renewal. Thank you!",
      }
    };

    return NextResponse.json({ success: true, settings: settingsObj });
  } catch (error: any) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST: Save settings configurations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pabbly_webhook_url, whatsapp_templates } = body;

    const updateData: any = {};
    if (pabbly_webhook_url !== undefined) {
      updateData.pabblyWebhookUrl = pabbly_webhook_url;
    }
    if (whatsapp_templates !== undefined) {
      updateData.whatsapp_templates = whatsapp_templates;
    }

    const updated = await dbService.updateSettings(updateData);

    return NextResponse.json({ success: true, message: "Settings updated successfully", settings: updated });
  } catch (error: any) {
    console.error("Save Settings Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
