"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppointmentStatusEnum, RouteEnum } from "@/types/enums";
import { AppointmentStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Calendar, Star, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { getPublicAvatarUrl } from "@/lib/supabaseStorage";

type AppointmentItem = {
  id: string;
  status: AppointmentStatus;
  slotTime: string;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    photo: string | null;
    doctorProfile: { specialty: { name: string } } | null;
  };
};

type ReviewItem = { doctorId: string; rating: number; comment: string | null };

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300",
  CONFIRMED:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300",
  CANCELLED:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300",
  COMPLETED:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300",
};

export function PatientAppointmentsList({
  appointments,
  reviews,
}: {
  appointments: AppointmentItem[];
  reviews: ReviewItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [optimisticReviews, setOptimisticReviews] = useState<ReviewItem[]>([]);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<{ rating: number; comment: string }>({
    defaultValues: { rating: 0, comment: "" },
  });

  const rating = watch("rating");

  const merged = new Map(reviews.map((r) => [r.doctorId, r]));
  optimisticReviews.forEach((r) => merged.set(r.doctorId, r));
  const reviewsByDoctor = merged;

  const openRateSheet = (apt: AppointmentItem) => {
    setSelectedDoctor({
      id: apt.doctor.id,
      name: `${apt.doctor.firstName} ${apt.doctor.lastName}`,
    });
    reset({ rating: 0, comment: "" });
    setOpen(true);
  };

  console.log(appointments, "appointments");

  const submitReview = async ({
    rating,
    comment,
  }: {
    rating: number;
    comment: string;
  }) => {
    if (!selectedDoctor || rating < 1 || rating > 5) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          rating,
          comment: comment.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to submit");
      }
      if (data.review) {
        setOptimisticReviews((prev) => [...prev, data.review]);
      }
      setOpen(false);
      setSelectedDoctor(null);
      reset({ rating: 0, comment: "" });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Rate {selectedDoctor?.name ?? "doctor"}</SheetTitle>
          </SheetHeader>
          {selectedDoctor && (
            <form
              onSubmit={handleSubmit(submitReview)}
              className="space-y-6 py-6 px-6"
            >
              <div>
                <Label>Rating (1–5)</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setValue("rating", n, { shouldValidate: true })
                      }
                      className="rounded p-2 border hover:bg-muted focus:ring-0 select-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          n <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-comment">Comment (optional)</Label>
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      id="review-comment"
                      className="mt-2 w-full min-h-24 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="How was your visit?"
                      rows={4}
                      {...field}
                    />
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={rating < 1 || isSubmitting}
                className="w-full cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit review"}
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>

      {appointments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No appointments yet.{" "}
          <Link href={RouteEnum.DOCTORS} className="text-primary underline">
            Find a doctor
          </Link>{" "}
          to book one.
        </p>
      ) : (
        <ul className="grid w-full grid-cols-1 gap-4 justify-items-stretch items-start lg:grid-cols-2 xl:grid-cols-3">
          {appointments.map((apt) => {
            const doctorName = `${apt.doctor.firstName} ${apt.doctor.lastName}`;
            const specialty = apt.doctor.doctorProfile?.specialty?.name ?? "—";
            const imageUrl = getPublicAvatarUrl(apt.doctor.photo);
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
            const statusClass = statusStyles[apt.status] ?? "";
            const existingReview = reviewsByDoctor.get(apt.doctor.id);
            const canRate = apt.status === AppointmentStatusEnum.COMPLETED;

            return (
              <li key={apt.id} className="w-full">
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                  <div className="flex flex-col sm:flex-row">
                    <div className="h-36 sm:h-auto sm:w-28 flex-shrink-0 bg-muted">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={doctorName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 min-w-0 flex flex-col justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground truncate">
                          {doctorName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {specialty}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {dateStr} · {timeStr}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-start items-center gap-4">
                        <span
                          className={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${statusClass}`}
                        >
                          {apt.status.toLowerCase()}
                        </span>
                        {!existingReview && canRate && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-fit text-xs cursor-pointer select-none"
                            onClick={() => openRateSheet(apt)}
                          >
                            <Star className="w-2 h-2 mr-1" />
                            Rate
                          </Button>
                        )}
                        {canRate && existingReview && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            You rated: {existingReview.rating}/5
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
