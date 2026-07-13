import { auth } from "@/auth";
import { connection } from "@/lib/database";
import HouseHoldModel from "@/models/HouseHooldModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  relation: z.string().min(1).optional(),
  age: z.number().int().positive().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connection();

    const updated = await HouseHoldModel.findOneAndUpdate(
      { _id: id, user_id: session.user.id }, // scoped so users can't edit others' members
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    const member = {
      id: updated._id.toString(),
      name: updated.name,
      relation: updated.relation,
      age: updated.age,
    };

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    console.error("Edit household member error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connection();

    const deleted = await HouseHoldModel.findOneAndDelete({
      _id: id,
      user_id: session.user.id, // scoped so users can't delete others' members
    });

    if (!deleted) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Member removed." }, { status: 200 });
  } catch (error) {
    console.error("Delete household member error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}