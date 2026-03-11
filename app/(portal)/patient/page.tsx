import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPublicAvatarUrl } from "@/lib/supabaseStorage";
import { RouteEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppointmentStatus } from "@prisma/client";
import { Calendar, User } from "lucide-react";

export default async function PatientProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(RouteEnum.LOGIN);

  const appointments = await prisma.appointment.findMany({
    where: { patientId: session.user.id },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          photo: true,
          doctorProfile: {
            select: {
              specialty: { select: { name: true } },
              id: true,
            },
          },
        },
      },
    },
    orderBy: { slotTime: "desc" },
  });

  const statusStyles: Record<AppointmentStatus, string> = {
    PENDING:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300",
    CONFIRMED:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300",
    CANCELLED:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300",
    COMPLETED:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Patient Profile</h1>
      <p className="text-muted-foreground">
        Here you will see your appointments and related details.
      </p>

      <section>
        <h2 className="text-lg font-semibold mb-4">Your appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No appointments yet.{" "}
            <Link href={RouteEnum.DOCTORS} className="text-primary underline">
              Find a doctor
            </Link>{" "}
            to book one.
          </p>
        ) : (
          <ul className="grid w-full grid-cols-1 gap-8 justify-items-start items-start sm:grid-cols-2 lg:grid-cols-3">
            {appointments.map((apt) => {
              const doctorName = `${apt.doctor.firstName} ${apt.doctor.lastName}`;
              const specialty =
                apt.doctor.doctorProfile?.specialty?.name ?? "—";
              const imageUrl = getPublicAvatarUrl(apt.doctor.photo);
              const slotDate = new Date(apt.slotTime);
              const dateStr = slotDate.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const timeStr = slotDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const statusClass = statusStyles[apt.status] ?? "";

              return (
                <li key={apt.id}>
                  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                    <div className="flex flex-col sm:flex-row">
                      <div className="h-32 sm:h-auto sm:w-28 flex-shrink-0 bg-muted">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={doctorName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <User className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 min-w-0 flex flex-col justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground truncate">
                            {doctorName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {specialty}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {dateStr} · {timeStr}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${statusClass}`}
                        >
                          {apt.status.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
