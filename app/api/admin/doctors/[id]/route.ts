import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RoleEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

const bodySchema = {
  firstName: (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim() : undefined,
  lastName: (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim() : undefined,
  experience: (v: unknown) => (typeof v === "number" && v >= 0 ? v : undefined),
  bio: (v: unknown) =>
    v === null || v === undefined || (typeof v === "string" && v.trim() === "")
      ? null
      : typeof v === "string"
        ? v.trim()
        : undefined,
  specialtyId: (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim() : undefined,
};

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== RoleEnum.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const firstName = bodySchema.firstName(body.firstName);
  const lastName = bodySchema.lastName(body.lastName);
  const experience = bodySchema.experience(body.experience);
  const bio = bodySchema.bio(body.bio);
  const specialtyId = bodySchema.specialtyId(body.specialtyId);

  if (
    firstName === undefined &&
    lastName === undefined &&
    experience === undefined &&
    bio === undefined &&
    specialtyId === undefined
  ) {
    return NextResponse.json(
      { error: "Provide at least one field to update" },
      { status: 400 },
    );
  }

  try {
    if (firstName !== undefined || lastName !== undefined) {
      await prisma.patient.update({
        where: { id },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
        },
      });
    }

    const profile = await prisma.doctorProfile.findUnique({
      where: { patientId: id },
    });
    if (
      profile &&
      (experience !== undefined ||
        bio !== undefined ||
        specialtyId !== undefined)
    ) {
      await prisma.doctorProfile.update({
        where: { patientId: id },
        data: {
          ...(experience !== undefined && { experience }),
          ...(bio !== undefined && { bio }),
          ...(specialtyId !== undefined && { specialtyId }),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update doctor" },
      { status: 400 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== RoleEnum.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.$transaction([
      prisma.appointment.deleteMany({
        where: { doctorId: id },
      }),
      prisma.review.deleteMany({
        where: { doctorId: id },
      }),
      prisma.patient.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 400 },
    );
  }
}
