import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPublicAvatarUrl } from "@/lib/supabaseStorage";
import { RouteEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { BookingConfirmButton } from "./BookingConfirmButton";
import { Button } from "@/components/ui/button";

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string; slot?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(RouteEnum.LOGIN);

  const { id: doctorId } = await params;
  const { date: dateStr, slot } = await searchParams;

  if (!dateStr || !slot) {
    redirect(`${RouteEnum.PATIENT_DOCTOR}/${doctorId}`);
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime()))
    redirect(`${RouteEnum.PATIENT_DOCTOR}/${doctorId}`);

  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: doctorId },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, photo: true },
      },
      specialty: { select: { name: true } },
    },
  });

  if (!doctor) notFound();

  const imageUrl = getPublicAvatarUrl(doctor.patient.photo);
  const doctorName = `${doctor.patient.firstName} ${doctor.patient.lastName}`;
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Confirm your booking</h1>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Doctor */}
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              Doctor
            </h2>
            <div className="flex items-center gap-4">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={doctorName}
                  className="w-30 h-30 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-muted" />
              )}
              <div>
                <p className="font-semibold text-lg">{doctorName}</p>
                <p className="text-lg text-muted-foreground ">
                  {doctor.specialty.name}
                </p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              Selected day
            </h2>
            <p className="font-medium">{formattedDate}</p>
          </section>
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              Time slot
            </h2>
            <p className="font-medium">{slot}</p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-muted-foreground mb-2">
              Patient information
            </h2>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="text-muted-foreground">Name: </span>
                <span className="font-medium">
                  {session.user.firstName} {session.user.lastName}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground">Email: </span>
                <span className="font-medium">{session.user.email}</span>
              </li>
            </ul>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <BookingConfirmButton
              doctorPatientId={doctor.patient.id}
              slotTime={dateStr + "T" + slot}
              patientId={session.user.id}
            />
            <Link
              href={`${RouteEnum.DOCTORS}/${doctorId}`}
              className="h-9 w-full sm:w-auto cursor-pointer border border-gray-500 p-[18px] rounded-[10px] flex justify-center items-center text-sm"
            >
              Back to booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
