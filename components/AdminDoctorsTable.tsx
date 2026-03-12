"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditDoctor, type EditDoctorFormValues } from "@/components/EditDoctor";
import { toast } from "sonner";

type DoctorRow = {
  id: string;
  firstName: string;
  lastName: string;
  reviews: number;
  rating: number;
  experience: number;
  specialty: string;
  specialtyId?: string | null;
  bio?: string | null;
};

export function AdminDoctorsTable({
  initialDoctors,
  specialties,
}: {
  initialDoctors: DoctorRow[];
  specialties: { id: string; name: string }[];
}) {
  const [rows, setRows] = useState<DoctorRow[]>(initialDoctors);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRow | null>(null);
  const [doctorToEdit, setDoctorToEdit] = useState<DoctorRow | null>(null);

  const totalDataCount = rows.length;

  const paginatedRows = useMemo(
    () =>
      rows.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize,
      ),
    [rows, currentPage, pageSize],
  );

  const confirmDelete = async () => {
    if (!selectedDoctor) return;
    const id = selectedDoctor.id;
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Failed to delete doctor");
      }
      setRows((prev) => prev.filter((d) => d.id !== id));
      setSelectedDoctor(null);
      toast.success("Doctor deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete doctor");
    }
  };

  const openDeleteDialog = (doctor: DoctorRow) => setSelectedDoctor(doctor);

  const handleEditSuccess = (data: EditDoctorFormValues) => {
    if (!doctorToEdit) return;
    const specialtyName =
      specialties.find((s) => s.id === data.specialtyId)?.name ??
      doctorToEdit.specialty;
    setRows((prev) =>
      prev.map((d) =>
        d.id === doctorToEdit.id
          ? {
              ...d,
              firstName: data.firstName,
              lastName: data.lastName,
              experience: data.experience,
              bio: data.bio || null,
              specialtyId: data.specialtyId || null,
              specialty: specialtyName,
            }
          : d,
      ),
    );
    setDoctorToEdit(null);
    toast.success("Doctor updated");
  };

  const columns = useMemo<ColumnDef<DoctorRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "firstName",
        header: "First name",
        cell: ({ row }) => row.original.firstName,
      },
      {
        accessorKey: "lastName",
        header: "Last name",
        cell: ({ row }) => row.original.lastName ?? "—",
      },
      {
        accessorKey: "bio",
        header: "Bio",
        cell: ({ row }) => row.original.bio ?? "—",
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (row.original.rating ?? 0).toFixed(1),
      },
      {
        accessorKey: "experience",
        header: "Experience",
        cell: ({ row }) => {
          const exp = row.original.experience ?? 0;
          return `${exp} ${exp === 1 ? "year" : "years"}`;
        },
      },
      {
        accessorKey: "specialty",
        header: "Specialty",
        cell: ({ row }) => row.original.specialty ?? "—",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setDoctorToEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="cursor-pointer"
              onClick={() => openDeleteDialog(row.original)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [openDeleteDialog],
  );

  return (
    <>
      <DataTable
        columns={columns}
        rows={paginatedRows}
        pageSize={pageSize}
        currentPage={currentPage}
        totalDataCount={totalDataCount}
        onChangePageSize={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        onPageChange={(page) => setCurrentPage(page)}
        onPrevPage={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        onNextPage={() =>
          setCurrentPage((prev) =>
            Math.min(
              Math.max(1, Math.ceil(totalDataCount / pageSize)),
              prev + 1,
            ),
          )
        }
      />

      <AlertDialog
        open={selectedDoctor !== null}
        onOpenChange={(open) => !open && setSelectedDoctor(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete doctor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              {selectedDoctor
                ? `"${selectedDoctor.firstName} ${selectedDoctor.lastName}"`
                : "this doctor"}{" "}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="cursor-pointer"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditDoctor
        open={doctorToEdit !== null}
        onOpenChange={(open) => !open && setDoctorToEdit(null)}
        doctor={doctorToEdit}
        specialties={specialties}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
