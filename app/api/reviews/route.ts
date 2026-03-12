import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppointmentStatusEnum, RoleEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const MIN_RATING = 1;
const MAX_RATING = 5;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== RoleEnum.PATIENT) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { doctorId: string; rating: number; comment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { doctorId, rating, comment } = body;
  if (!doctorId || typeof rating !== "number") {
    return NextResponse.json(
      { error: "doctorId and rating are required" },
      { status: 400 },
    );
  }
  if (rating < MIN_RATING || rating > MAX_RATING) {
    return NextResponse.json(
      { error: `rating must be between ${MIN_RATING} and ${MAX_RATING}` },
      { status: 400 },
    );
  }

  const existing = await prisma.review.findFirst({
    where: { patientId: session.user.id, doctorId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "You have already reviewed this doctor" },
      { status: 400 },
    );
  }

  const completedAppointment = await prisma.appointment.findFirst({
    where: {
      patientId: session.user.id,
      doctorId,
      status: AppointmentStatusEnum.COMPLETED,
    },
  });
  if (!completedAppointment) {
    return NextResponse.json(
      { error: "You can only review doctors after a completed appointment" },
      { status: 400 },
    );
  }

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        doctorId,
        patientId: session.user.id,
        rating,
        comment: comment?.trim() || null,
      },
      select: { doctorId: true, rating: true, comment: true },
    });

    // Recalculate doctor's average rating from all reviews (all patients)
    const agg = await tx.review.aggregate({
      where: { doctorId },
      _avg: { rating: true },
    });
    const rawAvg = agg._avg.rating ?? 0;
    const avgRating = Math.round(rawAvg * 100) / 100;

    await tx.doctorProfile.update({
      where: { patientId: doctorId },
      data: { rating: avgRating },
    });

    return created;
  });

  return NextResponse.json({ ok: true, review });
}
