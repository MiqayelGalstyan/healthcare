import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RoleEnum } from "@/types/enums";
import { AppointmentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const ALLOWED_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.CANCELLED,
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== RoleEnum.DOCTOR) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: appointmentId } = await params;
  let body: { status: AppointmentStatus };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { status } = body;
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Status must be CONFIRMED or CANCELLED" },
      { status: 400 },
    );
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 },
    );
  }
  if (appointment.doctorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (appointment.status !== AppointmentStatus.PENDING) {
    return NextResponse.json(
      { error: "Only PENDING appointments can be updated" },
      { status: 400 },
    );
  }
  if (new Date(appointment.slotTime) <= new Date()) {
    return NextResponse.json(
      { error: "Cannot update past appointments" },
      { status: 400 },
    );
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  return NextResponse.json({ ok: true });
}
