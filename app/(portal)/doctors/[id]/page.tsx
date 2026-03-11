import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DoctorDetails from "./DoctorDetails";

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doctor = await prisma.doctorProfile.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          photo: true,
          role: true,
          createdAt: true,
          doctorProfile: {
            select: {
              specialty: true,
              id: true,
              bio: true,
              experience: true,
              education: true,
              rating: true,
            },
          },
        },
      },
      specialty: true,
      availabilities: true,
    },
  });

  if (!doctor) notFound();

  return <DoctorDetails doctor={doctor} />;
}
