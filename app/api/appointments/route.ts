import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { doctorId: string; patientId: string; slotTime: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { doctorId, patientId, slotTime } = body;
  if (!doctorId || !patientId || !slotTime) {
    return NextResponse.json(
      { error: "Missing doctorId, patientId, or slotTime" },
      { status: 400 },
    );
  }

  if (session.user.id !== patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slotDate = new Date(slotTime);
  if (Number.isNaN(slotDate.getTime())) {
    return NextResponse.json({ error: "Invalid slotTime" }, { status: 400 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      doctorId,
      patientId,
      slotTime: slotDate,
    },
  });

  return NextResponse.json(appointment);
}
