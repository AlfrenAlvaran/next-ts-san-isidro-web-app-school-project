import { auth } from "@/auth";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
import ResidentProfileModel from "@/models/ResidentProfileModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import HouseHoldModel from "@/models/HouseHooldModel";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connection();

    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let profile = await ResidentProfileModel.findOne({ user: session.user.id });
    if (!profile) {
      profile = await ResidentProfileModel.create({ user: session.user.id });
    }

    const houseHoldMembers = await HouseHoldModel.find({
      user_id: session.user.id,
    }).sort({ createAt: 1 });

    return NextResponse.json(
      {
        profile: {
          fullName: user.fullName ?? "",
          email: user.email,
          phone: user.phone,

          birthdate: profile.birthdate
            ? profile.birthdate.toISOString().split("T")[0]
            : "",
          sex: profile.sex ?? "",
          civilStatus: profile.civilStatus ?? "",

          address: profile.address ?? "",
          purok: profile.purok ?? "",
          yearsResiding: profile.yearsResiding ?? "",

          contactNumber: user.phone,

          emergencyName: profile.emergencyName ?? "",
          emergencyRelation: profile.emergencyRelation ?? "",
          emergencyContact: profile.emergencyContact ?? "",

          idNumber: profile.idNumber ?? "",
          householdNo: profile.householdNo ?? "",
          memberSince: profile.memberSince
            ? profile.memberSince.toLocaleDateString("en-PH", {
                month: "short",
                year: "numeric",
              })
            : "",
          validThru: profile.validThru
            ? profile.validThru.toLocaleDateString("en-PH", {
                month: "short",
                year: "numeric",
              })
            : "",

          isVerified: user.isVerified,
          isApproved: user.isApproved,

          houseHoldMembers: houseHoldMembers.map((m) => ({
            id: m._id.toString(),
            name: m.name,
            relation: m.relation,
            age: m.age,
          })),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

// Treat empty strings as "not provided" so a blank field doesn't
// block saving the other fields sent in the same section.
const emptyToUndef = (v: unknown) => (v === "" ? undefined : v);

const updateSchema = z.object({
  fullName: z.preprocess(emptyToUndef, z.string().min(2).optional()),
  phone: z.preprocess(
    emptyToUndef,
    z
      .string()
      .regex(/^(09\d{9}|\+639\d{9})$/)
      .optional(),
  ),
  birthdate: z.preprocess(emptyToUndef, z.string().optional()),
  sex: z.preprocess(emptyToUndef, z.enum(["Female", "Male"]).optional()),
  civilStatus: z.preprocess(
    emptyToUndef,
    z.enum(["Single", "Married", "Widowed", "Separated"]).optional(),
  ),
  address: z.preprocess(emptyToUndef, z.string().min(5).optional()),
  purok: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  yearsResiding: z.preprocess(emptyToUndef, z.string().optional()),
  householdNo: z.preprocess(emptyToUndef, z.string().optional()),
  emergencyName: z.preprocess(emptyToUndef, z.string().min(2).optional()),
  emergencyRelation: z.preprocess(emptyToUndef, z.string().optional()),
  emergencyContact: z.preprocess(
    emptyToUndef,
    z
      .string()
      .regex(/^(09\d{9}|\+639\d{9})$/)
      .optional(),
  ),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message, field: firstIssue.path[0] },
        { status: 400 },
      );
    }

    const {
      fullName,
      phone,
      birthdate,
      sex,
      civilStatus,
      emergencyName,
      emergencyRelation,
      emergencyContact,
      address,
      purok,
      yearsResiding,
      householdNo,
    } = parsed.data;

    await connection();

    if (fullName !== undefined || phone !== undefined) {
      if (phone) {
        const existing = await UserModel.findOne({
          phone,
          _id: { $ne: session.user.id },
        });
        if (existing) {
          return NextResponse.json(
            { error: "This phone number is already in use.", field: "phone" },
            { status: 409 },
          );
        }
      }

      await UserModel.findByIdAndUpdate(
        session.user.id,
        {
          ...(fullName !== undefined && { fullName }),
          ...(phone !== undefined && { phone }),
        },
        { runValidators: true },
      );
    }

    const profileUpdates: Record<string, unknown> = {};
    if (birthdate !== undefined)
      profileUpdates.birthdate = birthdate ? new Date(birthdate) : null;
    if (sex !== undefined) profileUpdates.sex = sex;
    if (civilStatus !== undefined) profileUpdates.civilStatus = civilStatus;
    if (emergencyName !== undefined)
      profileUpdates.emergencyName = emergencyName;
    if (emergencyRelation !== undefined)
      profileUpdates.emergencyRelation = emergencyRelation;
    if (emergencyContact !== undefined)
      profileUpdates.emergencyContact = emergencyContact;
    if (address !== undefined) profileUpdates.address = address;
    if (purok !== undefined) profileUpdates.purok = purok;
    if (yearsResiding !== undefined)
      profileUpdates.yearsResiding = yearsResiding;
    if (householdNo !== undefined) profileUpdates.householdNo = householdNo;

    if (Object.keys(profileUpdates).length > 0) {
      await ResidentProfileModel.findOneAndUpdate(
        { user: session.user.id },
        { $set: profileUpdates },
        { upsert: true, runValidators: true },
      );
    }

    return NextResponse.json(
      { message: "Profile updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
