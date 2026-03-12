import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RouteEnum, RoleEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppointmentStatus } from "@prisma/client";
import { DoctorBookedPatients } from "./DoctorBookedPatients";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(RouteEnum.LOGIN);
  }

  if (session.user.role === RoleEnum.DOCTOR) {
    const now = new Date();

    await prisma.appointment.updateMany({
      where: {
        doctorId: session.user.id,
        status: AppointmentStatus.PENDING,
        slotTime: { lt: now },
      },
      data: { status: AppointmentStatus.COMPLETED },
    });

    const [appointments, doctorProfile] = await Promise.all([
      prisma.appointment.findMany({
        where: { doctorId: session.user.id },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { slotTime: "desc" },
      }),
      prisma.doctorProfile.findUnique({
        where: { patientId: session.user.id },
        select: { rating: true },
      }),
    ]);

    const serialized = appointments.map((apt) => ({
      id: apt.id,
      status: apt.status,
      slotTime: apt.slotTime.toISOString(),
      patient: apt.patient,
    }));

    return (
      <DoctorBookedPatients
        appointments={serialized}
        rating={doctorProfile?.rating ?? 0}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-lg text-gray-600">This is your dashboard page.</p>
    </div>
  );
}
