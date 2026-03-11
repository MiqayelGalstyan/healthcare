"use client";

import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "./ui/calendar";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { Availability } from "@prisma/client";
import { useTheme } from "@/hooks/useTheme";
import { ThemeEnum } from "@/types/enums";
import { RouteEnum } from "@/types/enums";

interface Props {
  doctorId: string;
  availableSlots: Availability[];
}

function getAvailabilityForDate(
  availabilities: Availability[],
  date: Date,
): Availability | undefined {
  const jsDay = date.getDay();
  const dayOfWeek = (jsDay + 6) % 7;
  return availabilities.find((a) => a.dayOfWeek === dayOfWeek);
}

function formatDateForUrl(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const Booking = ({ doctorId, availableSlots }: Props) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { theme } = useTheme();

  const dayAvailability = useMemo(
    () =>
      selectedDate
        ? getAvailabilityForDate(availableSlots, selectedDate)
        : undefined,
    [availableSlots, selectedDate],
  );

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) return;
    const date = formatDateForUrl(selectedDate);
    const params = new URLSearchParams({ date, slot: selectedTime });
    router.push(`${RouteEnum.PATIENT_DOCTOR}/${doctorId}/confirm?${params}`);
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <div
        className={`${theme === ThemeEnum.LIGHT ? "bg-white" : "bg-cardbg-white dark:bg-card"} rounded-2xl shadow-md p-6`}
      >
        <h2
          className={`text-2xl font-bold ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"} mb-6`}
        >
          Schedule Appointment
        </h2>
        <div className="mb-6">
          <h3
            className={`text-lg font-semibold ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"} mb-4`}
          >
            Select Date
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={{ before: new Date() }}
            className="w-full [--cell-size:2.75rem] text-base"
            classNames={{ root: "w-full" }}
          />
        </div>
        {selectedDate && (
          <div>
            <h3
              className={`text-lg font-semibold ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"} mb-4`}
            >
              Select Time
            </h3>
            {dayAvailability ? (
              <TimeSlotPicker
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                startTime={dayAvailability.startTime}
                endTime={dayAvailability.endTime}
                intervalMinutes={30}
                selectedDate={selectedDate}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                No availability for this day.
              </p>
            )}
          </div>
        )}
        {selectedDate && selectedTime && (
          <div
            className={`mt-6 p-4 ${theme === ThemeEnum.LIGHT ? "bg-blue-50 border border-blue-200" : "bg-blue-900 border border-blue-800"} rounded-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${theme === ThemeEnum.LIGHT ? "text-gray-600" : "text-white"} mb-1`}
                >
                  Selected Appointment
                </p>
                <p
                  className={`font-semibold ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"}`}
                >
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {selectedTime}
                </p>
              </div>
              <button
                onClick={handleBookAppointment}
                className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${theme === ThemeEnum.LIGHT ? "bg-white" : "bg-card dark:bg-card"} rounded-2xl shadow-md p-6`}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What to Expect
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>
            <span
              className={`text-sm ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"}`}
            >
              Bring your insurance card and valid ID
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>
            <span
              className={`text-sm ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"}`}
            >
              Arrive 15 minutes early to complete paperwork
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>
            <span
              className={`text-sm ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"}`}
            >
              Prepare a list of current medications and symptoms
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
