"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type EditPatientFormValues = {
  firstName: string;
  lastName: string;
};

export type EditPatientRow = {
  id: string;
  firstName: string;
  lastName: string;
};

type EditPatientProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: EditPatientRow | null;
  onSuccess: (data: EditPatientFormValues) => void;
};

export function EditPatient({
  open,
  onOpenChange,
  patient,
  onSuccess,
}: EditPatientProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EditPatientFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (patient) {
      reset({
        firstName: patient.firstName ?? "",
        lastName: patient.lastName ?? "",
      });
    }
  }, [patient, reset]);

  const onSubmit = async (data: EditPatientFormValues) => {
    if (!patient) return;
    try {
      const res = await fetch(`/api/admin/patients/${patient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Failed to update patient");
      }
      onSuccess(data);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-patient-firstName">First name</Label>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input
                  id="edit-patient-firstName"
                  {...field}
                  className="w-full"
                />
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-patient-lastName">Last name</Label>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input
                  id="edit-patient-lastName"
                  {...field}
                  className="w-full"
                />
              )}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
