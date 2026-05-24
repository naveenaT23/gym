import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// GET: Fetch all transaction receipts
export async function GET() {
  try {
    const payments = await dbService.getPayments();
    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    console.error("Payments API error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
