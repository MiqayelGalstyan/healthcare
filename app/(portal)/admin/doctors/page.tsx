import { prisma } from "@/lib/prisma";
import { RoleEnum } from "@/types/enums";
import { AdminDoctorsTable } from "@/components/AdminDoctorsTable";
import AddDoctor from "./AddDoctor";

export default async function AdminDoctorsPage() {
  const [doctors, specialties] = await Promise.all([
    prisma.patient.findMany({
      where: { role: RoleEnum.DOCTOR },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        _count: {
          select: { reviewsReceived: true },
        },
        doctorProfile: {
          select: {
            rating: true,
            experience: true,
            bio: true,
            specialtyId: true,
            specialty: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.specialty.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const rows = doctors.map((d) => ({
    id: d.id,
    firstName: d.firstName,
    lastName: d.lastName,
    reviews: d._count.reviewsReceived,
    rating: d.doctorProfile?.rating ?? 0,
    experience: d.doctorProfile?.experience ?? 0,
    specialty: d.doctorProfile?.specialty?.name ?? "—",
    specialtyId: d.doctorProfile?.specialtyId ?? null,
    bio: d.doctorProfile?.bio ?? null,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Manage Doctors</h1>
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground text-sm">
            View all doctors and remove them from the system if needed.
          </p>
          <AddDoctor />
        </div>
      </div>
      <AdminDoctorsTable initialDoctors={rows} specialties={specialties} />
    </div>
  );
}
