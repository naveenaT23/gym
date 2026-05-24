import { NextResponse } from "next/server";

// Static plans for Royal Fitness Gym
const GYM_PLANS = [
  { _id: "plan-monthly", name: "Monthly Plan", durationMonths: 1, price: 1500, description: "Access for 1 month" },
  { _id: "plan-quarterly", name: "Quarterly Plan", durationMonths: 3, price: 4000, description: "Access for 3 months" },
  { _id: "plan-halfyearly", name: "Half-Yearly Plan", durationMonths: 6, price: 7000, description: "Access for 6 months" },
  { _id: "plan-yearly", name: "Yearly Plan", durationMonths: 12, price: 12000, description: "Access for 12 months" },
];

export async function GET() {
  try {
    return NextResponse.json({ success: true, plans: GYM_PLANS });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, durationMonths, price, description } = body;

    const newPlan = {
      _id: `plan-${Date.now()}`,
      name,
      durationMonths: Number(durationMonths),
      price: Number(price),
      description: description || "",
    };

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
