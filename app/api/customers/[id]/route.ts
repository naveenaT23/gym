import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// GET: Retrieve a single member's profile
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const member = await dbService.getMemberById(id);
    if (!member) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Map database properties back to camelCase for frontend UI backward-compatibility
    const customer = {
      _id: member.id,
      fullName: member.name,
      mobileNumber: member.phone,
      whatsAppNumber: member.whatsapp_number,
      email: member.email || "",
      age: member.age || "",
      gender: member.gender || "",
      address: member.address || "",
      packageType: member.package_type,
      membershipPlan: member.membership_plan,
      joiningDate: member.join_date,
      expiryDate: member.expiry_date,
      paymentStatus: member.payment_status,
      amountPaid: member.amount_paid,
      notes: member.notes || "",
      photo: member.photo || "",
      trainerAssigned: member.trainer_assigned || "",
      dietPlanUrl: member.diet_plan_url || "",
      createdAt: member.created_at,
    };

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    console.error("Get Customer Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch customer" }, { status: 500 });
  }
}

// PUT: Update member's details
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Map frontend variables to database properties
    const updateData: any = {};
    if (body.fullName || body.name) updateData.name = body.fullName || body.name;
    if (body.mobileNumber || body.phone) updateData.phone = body.mobileNumber || body.phone;
    if (body.whatsAppNumber || body.whatsapp_number) updateData.whatsapp_number = body.whatsAppNumber || body.whatsapp_number;
    if (body.membershipPlan || body.membership_plan) updateData.membership_plan = body.membershipPlan || body.membership_plan;
    if (body.joiningDate || body.join_date) updateData.join_date = body.joiningDate || body.join_date;
    if (body.expiryDate || body.expiry_date) updateData.expiry_date = body.expiryDate || body.expiry_date;
    if (body.paymentStatus || body.payment_status) updateData.payment_status = body.paymentStatus || body.payment_status;
    if (body.amountPaid !== undefined || body.amount_paid !== undefined) {
      updateData.amount_paid = body.amountPaid !== undefined ? Number(body.amountPaid) : Number(body.amount_paid);
    }
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.photo !== undefined) updateData.photo = body.photo;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.age !== undefined) updateData.age = Number(body.age);
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.packageType !== undefined || body.package_type !== undefined) {
      updateData.package_type = body.packageType || body.package_type;
    }
    if (body.trainerAssigned !== undefined || body.trainer_assigned !== undefined) {
      updateData.trainer_assigned = body.trainerAssigned || body.trainer_assigned;
    }
    if (body.dietPlanUrl !== undefined || body.diet_plan_url !== undefined) {
      updateData.diet_plan_url = body.dietPlanUrl || body.diet_plan_url;
    }

    const updated = await dbService.updateMember(id, updateData);

    // Trigger webhook automation (like Pabbly) if configured
    const settings = await dbService.getSettings();
    if (settings && settings.pabblyWebhookUrl) {
      try {
        await fetch(settings.pabblyWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "customer_updated",
            member: updated,
          }),
        });
      } catch (webhookError) {
        console.error("Failed to fire Pabbly webhook:", webhookError);
      }
    }

    // Map database properties back to frontend format
    const returnedCustomer = {
      _id: updated.id,
      fullName: updated.name,
      mobileNumber: updated.phone,
      whatsAppNumber: updated.whatsapp_number,
      membershipPlan: updated.membership_plan,
      joiningDate: updated.join_date,
      expiryDate: updated.expiry_date,
      amountPaid: updated.amount_paid,
      paymentStatus: updated.payment_status,
      notes: updated.notes,
      photo: updated.photo,
      createdAt: updated.created_at,
    };

    return NextResponse.json({ success: true, customer: returnedCustomer });
  } catch (error: any) {
    console.error("Update Customer Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update customer" }, { status: 500 });
  }
}

// DELETE: Delete a member from roster
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch member before deleting, for webhook metadata
    const member = await dbService.getMemberById(id);
    if (!member) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    await dbService.deleteMember(id);

    // Trigger webhook automation (like Pabbly) if configured
    const settings = await dbService.getSettings();
    if (settings && settings.pabblyWebhookUrl) {
      try {
        await fetch(settings.pabblyWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "customer_deleted",
            id: member.id,
            name: member.name,
          }),
        });
      } catch (webhookError) {
        console.error("Failed to fire Pabbly webhook:", webhookError);
      }
    }

    return NextResponse.json({ success: true, message: "Customer deleted successfully" });
  } catch (error: any) {
    console.error("Delete Customer Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete customer" }, { status: 500 });
  }
}
