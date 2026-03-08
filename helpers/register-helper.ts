import { RegisterTypeEnum } from "@/types/enums";
import { z } from "zod";

const patientSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    photo: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const doctorSchema = patientSchema.extend({
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.number().min(0, "Experience is required"),
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
});

export const registerSchema = (currentType: RegisterTypeEnum) =>
  currentType === RegisterTypeEnum.DOCTOR ? doctorSchema : patientSchema;
