"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppointmentStatus } from "@prisma/client";
import { AppointmentStatusEnum } from "@/types/enums";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AppointmentRow = {
  id: string;
  status: AppointmentStatus;
  slotTime: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

const now = new Date();

export function DoctorBookedPatients({
  appointments: initialAppointments,
  rating = 0,
}: {
  appointments: AppointmentRow[];
  rating?: number;
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const router = useRouter();

  const updateStatus = async (appointmentId: string, status: AppointmentStatusEnum.CONFIRMED | AppointmentStatusEnum.CANCELLED) => {
    setUpdatingId(appointmentId);
    try {
      const res = await fetch(`/api/doctor/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
      );
      toast.success("Appointment status updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update appointment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <div className="mt-2 flex items-center gap-1.5 text-sm mb-4">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
          <span className="font-medium">
            Your rating: {rating.toFixed(1)}
          </span>
        </div>
        <p className="text-muted-foreground">Your booked patients.</p>
      </div>

      {appointments.length === 0 ? (
        <p className="text-muted-foreground text-sm">No appointments yet.</p>
      ) : (
        <ul className="grid w-full grid-cols-1 gap-4 justify-items-start items-start sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((apt) => {
            const patientName = `${apt.patient.firstName} ${apt.patient.lastName}`;
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
            const isPast = slotDate.getTime() <= now.getTime();
            const canChangeStatus =
              apt.status === AppointmentStatus.PENDING && !isPast;
            const isUpdating = updatingId === apt.id;

            const statusStyles: Record<AppointmentStatus, string> = {
              PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300",
              CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300",
              CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300",
              COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300",
            };

            return (
              <li key={apt.id} className="w-full max-w-sm">
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <p className="font-semibold text-foreground">{patientName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {apt.patient.email}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {dateStr} · {timeStr}
                  </p>
                  <span
                    className={`inline-flex mt-2 rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[apt.status] ?? "bg-muted"}`}
                  >
                    {apt.status.toLowerCase()}
                  </span>
                  {canChangeStatus && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => updateStatus(apt.id, AppointmentStatusEnum.CONFIRMED)}
                        className="cursor-pointer"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isUpdating}
                        onClick={() => updateStatus(apt.id, AppointmentStatusEnum.CANCELLED)}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
