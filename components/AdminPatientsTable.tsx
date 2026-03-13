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
import { format } from "date-fns";
import { toast } from "sonner";
import {
  EditPatient,
  type EditPatientFormValues,
} from "@/components/EditPatient";

type PatientRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date | string;
};

export function AdminPatientsTable({
  initialPatients,
}: {
  initialPatients: PatientRow[];
}) {
  const [rows, setRows] = useState<PatientRow[]>(initialPatients);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<PatientRow | null>(
    null,
  );
  const [patientToEdit, setPatientToEdit] = useState<PatientRow | null>(null);

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
    if (!selectedPatient) return;
    const id = selectedPatient.id;
    try {
      const res = await fetch(`/api/admin/patients/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Failed to delete patient");
      }
      setRows((prev) => prev.filter((p) => p.id !== id));
      setSelectedPatient(null);
      toast.success("Patient deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete patient");
    }
  };

  const openDeleteDialog = (patient: PatientRow) => setSelectedPatient(patient);

  const handleEditSuccess = (data: EditPatientFormValues) => {
    if (!patientToEdit) return;
    setRows((prev) =>
      prev.map((p) =>
        p.id === patientToEdit.id
          ? {
              ...p,
              firstName: data.firstName,
              lastName: data.lastName,
            }
          : p,
      ),
    );
    setPatientToEdit(null);
    toast.success("Patient updated");
  };

  const columns = useMemo<ColumnDef<PatientRow>[]>(
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
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.email,
      },
      {
        accessorKey: "createdAt",
        header: "Registered",
        cell: ({ row }) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy"),
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
              onClick={() => setPatientToEdit(row.original)}
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
        open={selectedPatient !== null}
        onOpenChange={(open) => !open && setSelectedPatient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              {selectedPatient
                ? `"${selectedPatient.firstName} ${selectedPatient.lastName}"`
                : "this patient"}
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

      <EditPatient
        open={patientToEdit !== null}
        onOpenChange={(open) => !open && setPatientToEdit(null)}
        patient={patientToEdit}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
