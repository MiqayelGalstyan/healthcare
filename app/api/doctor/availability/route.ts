import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RoleEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

function parseTime(s: string): { h: number; m: number } | null {
  if (!TIME_REGEX.test(s)) return null;
  const [h, m] = s.split(":").map(Number);
  return { h, m };
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== RoleEnum.DOCTOR) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    availabilities: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { availabilities } = body;
  if (!Array.isArray(availabilities)) {
    return NextResponse.json(
      { error: "availabilities must be an array" },
      { status: 400 },
    );
  }

  for (const a of availabilities) {
    if (
      typeof a.dayOfWeek !== "number" ||
      a.dayOfWeek < 0 ||
      a.dayOfWeek > 6 ||
      typeof a.startTime !== "string" ||
      typeof a.endTime !== "string"
    ) {
      return NextResponse.json(
        { error: "Each item must have dayOfWeek (0-6), startTime, endTime" },
        { status: 400 },
      );
    }
    if (!parseTime(a.startTime) || !parseTime(a.endTime)) {
      return NextResponse.json(
        { error: "startTime and endTime must be HH:mm" },
        { status: 400 },
      );
    }
  }

  const doctor = await prisma.doctorProfile.findUnique({
    where: { patientId: session.user.id },
  });
  if (!doctor) {
    return NextResponse.json(
      { error: "Doctor profile not found" },
      { status: 404 },
    );
  }

  await prisma.$transaction([
    prisma.availability.deleteMany({ where: { doctorId: doctor.id } }),
    ...availabilities.map((a) =>
      prisma.availability.create({
        data: {
          doctorId: doctor.id,
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
        },
      }),
    ),
  ]);

  return NextResponse.json({ ok: true });
}
