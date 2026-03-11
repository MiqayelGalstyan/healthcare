"use client";

import { useTheme } from "@/hooks/useTheme";
import { ThemeEnum } from "@/types/enums";
import { Clock } from "lucide-react";
import { useMemo } from "react";

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Generate slots from startTime to endTime (end exclusive), every intervalMinutes. */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30,
): string[] {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  const slots: string[] = [];
  for (let min = start; min < end; min += intervalMinutes) {
    slots.push(formatMinutesToTime(min));
  }
  return slots;
}

/** True if slot time has passed on the given date (e.g. today). */
function isSlotExpired(slotTime: string, date: Date): boolean {
  const [h, m] = slotTime.split(":").map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(h ?? 0, m ?? 0, 0, 0);
  return slotDate.getTime() <= Date.now();
}

interface TimeSlotPickerProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  /** When set, slots are generated from start to end every intervalMinutes. */
  startTime?: string;
  endTime?: string;
  intervalMinutes?: number;
  /** When set (e.g. today), slots in the past are disabled. */
  selectedDate?: Date;
  /** Pre-computed slots; used when startTime/endTime are not provided. */
  availableSlots?: string[];
}

export function TimeSlotPicker({
  selectedTime,
  onSelectTime,
  startTime = "09:00",
  endTime = "17:00",
  intervalMinutes = 30,
  selectedDate,
  availableSlots: availableSlotsProp,
}: TimeSlotPickerProps) {
  const availableSlots = useMemo(() => {
    if (availableSlotsProp?.length) return availableSlotsProp;
    return generateTimeSlots(startTime, endTime, intervalMinutes);
  }, [availableSlotsProp, startTime, endTime, intervalMinutes]);

  const { theme } = useTheme();

  const isToday = selectedDate
    ? selectedDate.toDateString() === new Date().toDateString()
    : false;

  return (
    <div
      className={`${theme === ThemeEnum.LIGHT ? "bg-white" : "bg-card dark:bg-card"} rounded-xl border border-gray-200 p-4`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3
          className={`text-lg font-semibold ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"}`}
        >
          Available Time Slots
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {availableSlots.map((slot) => {
          const disabled = isToday && isSlotExpired(slot, selectedDate!);
          return (
            <button
              key={slot}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelectTime(slot)}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                disabled
                  ? "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
                  : selectedTime === slot
                    ? "bg-blue-600 text-white border-2 border-blue-600"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
