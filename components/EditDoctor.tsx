"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCTOR_SPECIALITIES } from "@/constants";

export type EditDoctorFormValues = {
  firstName: string;
  lastName: string;
  experience: number;
  bio: string;
  specialtyId: string;
};

type SpecialtyOption = { id: string; name: string };

export type EditDoctorDoctor = {
  id: string;
  firstName: string;
  lastName: string;
  experience: number;
  bio?: string | null;
  specialtyId?: string | null;
  specialty?: string;
};

type EditDoctorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: EditDoctorDoctor | null;
  specialties: SpecialtyOption[];
  onSuccess: (data: EditDoctorFormValues) => void;
};

function defaultSpecialtyValue(
  doctorSpecialtyName: string | undefined,
): string {
  if (!doctorSpecialtyName?.trim()) return DOCTOR_SPECIALITIES[0]?.value ?? "";
  const normalized = doctorSpecialtyName.trim();
  const match = DOCTOR_SPECIALITIES.find(
    (s) => s.label.toLowerCase() === normalized.toLowerCase(),
  );
  return match?.value ?? DOCTOR_SPECIALITIES[0]?.value ?? "";
}

export function EditDoctor({
  open,
  onOpenChange,
  doctor,
  specialties,
  onSuccess,
}: EditDoctorProps) {
  type FormValues = {
    firstName: string;
    lastName: string;
    experience: number;
    bio: string;
    specialtyValue: string;
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      experience: 0,
      bio: "",
      specialtyValue: "",
    },
  });

  useEffect(() => {
    if (doctor) {
      reset({
        firstName: doctor.firstName ?? "",
        lastName: doctor.lastName ?? "",
        experience: doctor.experience ?? 0,
        bio: doctor.bio ?? "",
        specialtyValue: defaultSpecialtyValue(doctor.specialty),
      });
    }
  }, [doctor, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!doctor) return;
    const label = DOCTOR_SPECIALITIES.find(
      (s) => s.value === data.specialtyValue,
    )?.label;
    const specialtyId = label
      ? specialties.find((s) => s.name.toLowerCase() === label.toLowerCase())
          ?.id
      : undefined;
    const payload: EditDoctorFormValues = {
      firstName: data.firstName,
      lastName: data.lastName,
      experience: data.experience,
      bio: data.bio,
      specialtyId: specialtyId ?? "",
    };
    try {
      const res = await fetch(`/api/admin/doctors/${doctor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          experience: Number(payload.experience),
          bio: payload.bio.trim() || null,
          specialtyId: specialtyId || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Failed to update doctor");
      }
      onSuccess(payload);
      onOpenChange(false);
    } catch (e) {
      throw e;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit doctor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-firstName">First name</Label>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input id="edit-firstName" {...field} className="w-full" />
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-lastName">Last name</Label>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input id="edit-lastName" {...field} className="w-full" />
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-experience">Experience (years)</Label>
            <Controller
              name="experience"
              control={control}
              rules={{
                required: "Required",
                min: { value: 0, message: "Min 0" },
              }}
              render={({ field }) => (
                <Input
                  id="edit-experience"
                  type="text"
                  className="w-full"
                  value={field.value ?? ""}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                />
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-bio">Bio</Label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <textarea
                  id="edit-bio"
                  {...field}
                  className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Short bio"
                />
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label>Specialty</Label>
            <Controller
              name="specialtyValue"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCTOR_SPECIALITIES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
