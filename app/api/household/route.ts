import { auth } from "@/auth";
import { connection } from "@/lib/database";
import HouseHoldModel from "@/models/HouseHooldModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const memberSchema = z.object({
  name: z.string().min(2),
  relation: z.string().min(1),
  age: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = memberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connection();

    const created = await HouseHoldModel.create({
      ...parsed.data,
      user_id: session.user.id,
    });

    const member = {
      id: created._id.toString(),
      name: created.name,
      relation: created.relation,
      age: created.age,
    };

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Add household member error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}