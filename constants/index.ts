export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DOCTOR_SPECIALITIES = [
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "radiology", label: "Radiology" },
  { value: "general_medicine", label: "General Medicine" },
  { value: "gynecology", label: "Gynecology" },
];

export const SPECIALITY_VALUES = DOCTOR_SPECIALITIES.map((s) => s.value) as [
  string,
  ...string[],
];

export const DEFAULT_TIME_SLOTS = { start: "09:00", end: "17:00" };

export const dataTableConfig = {
  initialPage: 1,
  initialPageSize: 20,
  pageSizeOptions: [20, 50, 100],
};
