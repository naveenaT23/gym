import { NextResponse } from "next/server";

// PUT: Update plan terms
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, durationMonths, price, description, isActive } = body;

    const mockUpdatedPlan = {
      _id: id,
      name,
      durationMonths: Number(durationMonths),
      price: Number(price),
      description: description || "",
      isActive: isActive !== undefined ? isActive : true,
    };

    return NextResponse.json({ success: true, plan: mockUpdatedPlan });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

// DELETE: Deactivate a plan
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return NextResponse.json({ success: true, message: `Plan ${id} deactivated successfully` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to deactivate plan" }, { status: 500 });
  }
}
