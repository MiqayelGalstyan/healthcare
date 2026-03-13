"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RouteEnum } from "@/types/enums";

const CONFIRMED_PATH = RouteEnum.PATIENT_APPOINTMENT_CONFIRMED;

interface Props {
  doctorPatientId: string;
  slotTime: string;
  patientId: string;
}

export function BookingConfirmButton({
  doctorPatientId,
  slotTime,
  patientId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctorPatientId,
          patientId,
          slotTime: new Date(slotTime).toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to book");
      router.push(CONFIRMED_PATH);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConfirm}
      disabled={loading}
      className="w-full sm:w-auto cursor-pointer"
    >
      {loading ? "Confirming..." : "Confirm"}
    </Button>
  );
}
