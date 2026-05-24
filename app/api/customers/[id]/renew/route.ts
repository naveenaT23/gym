import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// POST: Record member plan renewal
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      membershipPlan,
      joiningDate,
      amountPaid,
      paymentStatus,
      customDurationMonths,
    } = body;

    if (!membershipPlan || !joiningDate || amountPaid === undefined || !paymentStatus) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const member = await dbService.getMemberById(id);
    if (!member) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // 1. Calculate Expiry Date
    const start = new Date(joiningDate);
    const expiry = new Date(joiningDate);

    let determinedPackageType = "Monthly";
    const planLower = membershipPlan.toLowerCase();
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

    // 2. Execute renewal database update (this will automatically add a payment entry)
    const renewed = await dbService.renewMember(id, {
      package_type: determinedPackageType,
      membership_plan: membershipPlan,
      join_date: joiningDate.split("T")[0],
      expiry_date: expiryStr,
      amount_paid: Number(amountPaid),
      payment_status: paymentStatus,
    });

    // 3. Trigger webhook automation (like Pabbly) if configured
    const settings = await dbService.getSettings();
    if (settings && settings.pabblyWebhookUrl) {
      try {
        await fetch(settings.pabblyWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "customer_renewed",
            member: renewed,
          }),
        });
      } catch (webhookError) {
        console.error("Failed to fire Pabbly webhook:", webhookError);
      }
    }

    // Map database properties back to frontend format
    const returnedCustomer = {
      _id: renewed.id,
      fullName: renewed.name,
      mobileNumber: renewed.phone,
      whatsAppNumber: renewed.whatsapp_number,
      membershipPlan: renewed.membership_plan,
      joiningDate: renewed.join_date,
      expiryDate: renewed.expiry_date,
      amountPaid: renewed.amount_paid,
      paymentStatus: renewed.payment_status,
      notes: renewed.notes,
    };

    return NextResponse.json({ success: true, customer: returnedCustomer });
  } catch (error: any) {
    console.error("Renew Customer Error:", error);
    return NextResponse.json({ error: error.message || "Failed to renew member" }, { status: 500 });
  }
}
