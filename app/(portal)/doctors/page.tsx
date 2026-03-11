import FindDoctors from "@/components/FindDoctors";
import { prisma } from "@/lib/prisma";
import { IFoundDoctor } from "@/types/interfaces/doctor";

export default async function DoctorsPage() {
  const doctors: IFoundDoctor[] = await prisma.doctorProfile.findMany({
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
        },
      },
      specialty: true,
    },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Doctors</h1>
      <FindDoctors doctors={doctors} />
    </div>
  );
}
