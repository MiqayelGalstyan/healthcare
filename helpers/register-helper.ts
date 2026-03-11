import { SPECIALITY_VALUES } from "@/constants";
import { RegisterTypeEnum } from "@/types/enums";
import { z } from "zod";

const patientSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    photo: z.string().min(1, "Photo is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const doctorSchema = patientSchema.extend({
  specialty: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .transform((obj) => obj.value) // keep only the value
    .refine(
      (val) => SPECIALITY_VALUES.includes(val),
      "Specialization is required",
    ),
  experience: z.string().min(1, "Experience is required"),
  education: z.string().min(1, "Education is required"),
  workingDays: z.array(z.string()).min(1, "Select at least one working day"),
  workingHours: z
    .record(
      z.string(),
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    )
    .optional(),
  bio: z.string().min(1, "Bio is required"),
});

export const registerSchema = (currentType: RegisterTypeEnum) =>
  currentType === RegisterTypeEnum.DOCTOR ? doctorSchema : patientSchema;
