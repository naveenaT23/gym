export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // 1. Get all members
    const allMembers = await dbService.getMembers();

    const totalMembers = allMembers.length;
    const activeMembers = allMembers.filter((m) => new Date(m.expiry_date) >= today).length;
    const expiredMembers = allMembers.filter((m) => new Date(m.expiry_date) < today).length;
    const upcomingRenewals = allMembers.filter((m) => {
      const exp = new Date(m.expiry_date);
      return exp >= today && exp <= sevenDaysFromNow;
    }).length;

    // 2. Generate chart data for the last 6 months (Registrations & Revenue)
    const monthsData: { [key: string]: { name: string; members: number; revenue: number } } = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toISOString().substring(0, 7); // "YYYY-MM"
      const monthName = d.toLocaleString("default", { month: "short" });
      monthsData[monthKey] = { name: monthName, members: 0, revenue: 0 };
    }

    // Populate registration growth
    allMembers.forEach((member) => {
      if (member.created_at) {
        const regMonth = new Date(member.created_at).toISOString().substring(0, 7);
        if (monthsData[regMonth]) {
          monthsData[regMonth].members += 1;
        }
      }
    });

    // Populate revenue from actual transactions ledger
    const allPayments = await dbService.getPayments();
    allPayments.forEach((payment) => {
      if (payment.payment_date) {
        const payMonth = new Date(payment.payment_date).toISOString().substring(0, 7);
        if (monthsData[payMonth]) {
          monthsData[payMonth].revenue += Number(payment.amount);
        }
      }
    });

    const chartData = Object.values(monthsData);

    // 3. Get recent members (limit 5)
    // Map properties to camelCase for the frontend page templates
    const recentMembers = allMembers
      .slice(0, 5)
      .map((m) => ({
        _id: m.id,
        fullName: m.name,
        membershipPlan: m.membership_plan,
        paymentStatus: m.payment_status,
        expiryDate: m.expiry_date,
        createdAt: m.created_at,
      }));

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        expiredMembers,
        upcomingRenewals,
      },
      chartData,
      recentMembers,
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
