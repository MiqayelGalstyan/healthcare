import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RoleEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export type ActivityPoint = {
  date: string;
  patients: number;
  doctors: number;
};

function bucketByDay(dates: { createdAt: Date }[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const { createdAt } of dates) {
    const d = new Date(createdAt);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== RoleEnum.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

  const [recentPatients, recentDoctors] = await Promise.all([
    prisma.patient.findMany({
      where: {
        role: RoleEnum.PATIENT,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    }),
    prisma.patient.findMany({
      where: {
        role: RoleEnum.DOCTOR,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    }),
  ]);

  const patientsByDay = bucketByDay(recentPatients);
  const doctorsByDay = bucketByDay(recentDoctors);

  const data: ActivityPoint[] = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));
    const key = day.toISOString().slice(0, 10);
    return {
      date: key,
      patients: patientsByDay.get(key) ?? 0,
      doctors: doctorsByDay.get(key) ?? 0,
    };
  });

  return NextResponse.json({ data });
}
