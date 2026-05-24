export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// GET: Fetch members roster with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const plan = searchParams.get("plan") || "";
    const status = searchParams.get("status") || "";
    const active = searchParams.get("active") || "";

    const customersRaw = await dbService.getMembers({ search, plan, status, active });
    
    // Map database properties (name, phone, etc.) back to camelCase for frontend UI backward-compatibility
    const customers = customersRaw.map((c: any) => ({
      _id: c.id,
      fullName: c.name,
      mobileNumber: c.phone,
      whatsAppNumber: c.whatsapp_number,
      email: c.email || "",
      age: c.age || "",
      gender: c.gender || "",
      address: c.address || "",
      packageType: c.package_type,
      membershipPlan: c.membership_plan,
      joiningDate: c.join_date,
      expiryDate: c.expiry_date,
      paymentStatus: c.payment_status,
      amountPaid: c.amount_paid,
      notes: c.notes || "",
      photo: c.photo || "",
      trainerAssigned: c.trainer_assigned || "",
      createdAt: c.created_at,
    }));

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    console.error("Fetch Customers Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch customers" }, { status: 500 });
  }
}

// POST: Register a new customer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      name,
      mobileNumber,
      phone,
      whatsAppNumber,
      whatsapp_number,
      membershipPlan,
      membership_plan,
      joiningDate,
      join_date,
      amountPaid,
      amount_paid,
      paymentStatus,
      payment_status,
      notes,
      email,
      age,
      gender,
      address,
      package_type,
      trainer_assigned,
      customDurationMonths
    } = body;

    const finalName = fullName || name;
    const finalPhone = mobileNumber || phone;
    const finalWhatsApp = whatsAppNumber || whatsapp_number;
    const finalPlan = membershipPlan || membership_plan;
    const finalJoinDate = joiningDate || join_date;
    const finalAmountPaid = amountPaid !== undefined ? amountPaid : amount_paid;
    const finalPaymentStatus = paymentStatus || payment_status;

    if (
      !finalName ||
      !finalPhone ||
      !finalWhatsApp ||
      !finalPlan ||
      !finalJoinDate ||
      finalAmountPaid === undefined ||
      !finalPaymentStatus
    ) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    // 1. Calculate Expiry Date
    const start = new Date(finalJoinDate);
    const expiry = new Date(finalJoinDate);

    // Determine package type if not explicitly passed
    let determinedPackageType = package_type;
    if (!determinedPackageType) {
      const planLower = finalPlan.toLowerCase();
      if (planLower.includes("monthly")) {
        determinedPackageType = "Monthly";
      } else if (planLower.includes("quarterly")) {
        determinedPackageType = "Quarterly";
      } else if (planLower.includes("half")) {
        determinedPackageType = "Half-Yearly";
      } else if (planLower.includes("yearly")) {
        determinedPackageType = "Yearly";
      } else {
        determinedPackageType = "Custom";
      }
    }

    let durationMonths = 1;
    if (determinedPackageType === "Monthly") durationMonths = 1;
    else if (determinedPackageType === "Quarterly") durationMonths = 3;
    else if (determinedPackageType === "Half-Yearly") durationMonths = 6;
    else if (determinedPackageType === "Yearly") durationMonths = 12;
    else if (customDurationMonths) {
      durationMonths = Number(customDurationMonths);
    }

    expiry.setMonth(start.getMonth() + durationMonths);
    const expiryStr = expiry.toISOString().split("T")[0];

    // 2. Add Member to Database
    const newMember = await dbService.addMember({
      name: finalName,
      photo: body.photo || "",
      phone: finalPhone,
      whatsapp_number: finalWhatsApp,
      email: email || "",
      age: age ? Number(age) : 0,
      gender: gender || "Male",
      address: address || "",
      package_type: determinedPackageType,
      membership_plan: finalPlan,
      join_date: finalJoinDate.split("T")[0],
      expiry_date: expiryStr,
      payment_status: finalPaymentStatus,
      amount_paid: Number(finalAmountPaid),
      notes: notes || "",
      trainer_assigned: trainer_assigned || "",
    });

    // 3. Trigger webhook automation (like Pabbly) if configured
    const settings = await dbService.getSettings();
    if (settings && settings.pabblyWebhookUrl) {
      try {
        await fetch(settings.pabblyWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "customer_registered",
            member: newMember,
          }),
        });
      } catch (webhookError) {
        console.error("Failed to fire Pabbly webhook:", webhookError);
      }
    }

    // Map database properties back to frontend format
    const returnedCustomer = {
      _id: newMember.id,
      fullName: newMember.name,
      mobileNumber: newMember.phone,
      whatsAppNumber: newMember.whatsapp_number,
      membershipPlan: newMember.membership_plan,
      joiningDate: newMember.join_date,
      expiryDate: newMember.expiry_date,
      amountPaid: newMember.amount_paid,
      paymentStatus: newMember.payment_status,
      notes: newMember.notes,
      photo: newMember.photo,
      createdAt: newMember.created_at,
    };

    return NextResponse.json({ success: true, customer: returnedCustomer });
  } catch (error: any) {
    console.error("Create Customer Error:", error);
    return NextResponse.json({ error: error.message || "Failed to register member" }, { status: 500 });
  }
}
