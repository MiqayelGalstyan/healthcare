import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RouteEnum, RoleEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppointmentStatus } from "@prisma/client";
import { DoctorBookedPatients } from "./DoctorBookedPatients";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardActivityChart } from "@/components/DashboardActivityChart";

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

  const [totalUsers, totalDoctors, totalConfirmedAppointments] =
    await Promise.all([
      prisma.patient.count({
        where: { role: RoleEnum.PATIENT },
      }),
      prisma.doctorProfile.count(),
      prisma.appointment.count({
        where: { status: AppointmentStatus.CONFIRMED },
      }),
    ]);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total active users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUsers}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              All registered patients
            </div>
            <div className="text-muted-foreground">
              Users with an account in the system
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total active doctors</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalDoctors}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Doctors available in the system
            </div>
            <div className="text-muted-foreground">
              Based on doctor profiles
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total confirmed appointments</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalConfirmedAppointments}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              All confirmed appointments
            </div>
            <div className="text-muted-foreground">
              Across all doctors and patients
            </div>
          </CardFooter>
        </Card>
      </div>

      <DashboardActivityChart />
    </div>
  );
}
