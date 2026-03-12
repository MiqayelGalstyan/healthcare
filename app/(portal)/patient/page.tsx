import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RouteEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PatientAppointmentsList } from "./PatientAppointmentsList";

export const dynamic = "force-dynamic";

export default async function PatientProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(RouteEnum.LOGIN);

  const [appointments, reviews] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId: session.user.id },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            doctorProfile: {
              select: { specialty: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { slotTime: "desc" },
    }),
    prisma.review.findMany({
      where: { patientId: session.user.id },
      select: { doctorId: true, rating: true, comment: true },
    }),
  ]);

  const serializedAppointments = appointments.map((apt) => ({
    id: apt.id,
    status: apt.status,
    slotTime: apt.slotTime.toISOString(),
    doctor: {
      id: apt.doctor.id,
      firstName: apt.doctor.firstName,
      lastName: apt.doctor.lastName,
      photo: apt.doctor.photo,
      doctorProfile: apt.doctor.doctorProfile,
    },
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Patient Profile</h1>
      <p className="text-muted-foreground">
        Here you will see your appointments.
      </p>

      <section>
        <h2 className="text-lg font-semibold mb-4">Your appointments</h2>
        <PatientAppointmentsList
          appointments={serializedAppointments}
          reviews={reviews ?? []}
        />
      </section>
    </div>
  );
}
