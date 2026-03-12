import { prisma } from "@/lib/prisma";
import { RoleEnum } from "@/types/enums";
import { AdminPatientsTable } from "@/components/AdminPatientsTable";
import AddPatient from "./AddPatient";

export default async function AdminPatientsPage() {
  const patients = await prisma.patient.findMany({
    where: { role: RoleEnum.PATIENT },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = patients.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    createdAt: p.createdAt,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Manage Patients</h1>
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground text-sm">
            View all patients and remove them from the system if needed.
          </p>
          <AddPatient />
        </div>
      </div>
      <AdminPatientsTable initialPatients={rows} />
    </div>
  );
}
