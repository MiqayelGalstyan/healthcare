import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RouteEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AvailabilityEditor } from "./AvailabilityEditor";

export default async function DoctorProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(RouteEnum.LOGIN);

  const doctor = await prisma.doctorProfile.findUnique({
    where: { patientId: session.user.id },
    include: { availabilities: true },
  });

  if (!doctor) {
    redirect(RouteEnum.DASHBOARD);
  }

  const availabilities = doctor.availabilities.map((a) => ({
    dayOfWeek: a.dayOfWeek,
    startTime: a.startTime,
    endTime: a.endTime,
  }));

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-4">Working hours (timeslots)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Set start and end time for each day you see patients. Enable the days you work.
        </p>
        <AvailabilityEditor initial={availabilities} />
      </section>
    </div>
  );
}
