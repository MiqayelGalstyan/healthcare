"use client";

import { ReactNode } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { RegisterTypeEnum, RouteEnum, ThemeEnum } from "@/types/enums";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IRegisterPayload } from "@/types/interfaces/register";
import { registerSchema } from "@/helpers/register-helper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/PasswordInput";
import ImageUpload from "@/components/ImageUpload";
import { cn } from "@/lib/utils";
import { daysOfWeek, DOCTOR_SPECIALITIES } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface Props {
    children?: ReactNode;
    type: RegisterTypeEnum | undefined;
    onSubmit: (data: IRegisterPayload) => void;
}

const RegisterForm = ({ children, type, onSubmit }: Props) => {
    const { theme } = useTheme();

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,

    } = useForm<IRegisterPayload>({
        resolver: zodResolver(registerSchema(type!)),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            photo: "",
            specialization: null,
            experience: "",
            education: "",
            workingDays: [],
            workingHours: {
                [daysOfWeek[0]]: { start: "09:00", end: "17:00" },
                [daysOfWeek[1]]: { start: "09:00", end: "17:00" },
                [daysOfWeek[2]]: { start: "09:00", end: "17:00" },
                [daysOfWeek[3]]: { start: "09:00", end: "17:00" },
                [daysOfWeek[4]]: { start: "09:00", end: "17:00" },
                [daysOfWeek[5]]: { start: "09:00", end: "17:00" },
                [daysOfWeek[6]]: { start: "09:00", end: "17:00" },
            },
            contactInformation: "",
        },
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const workingDays =
        useWatch({
            control,
            name: "workingDays",
            defaultValue: [],
        }) || [];

    return (
        <div className="flex justify-between items-start gap-10">
            {children}
            <Card className="flex-2 p-6">
                <CardTitle>
                    {!type
                        ? "Please select account type to proceed"
                        : type === RegisterTypeEnum.PATIENT
                            ? "Patient Registration"
                            : "Doctor Registration"}
                </CardTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="first-name">First Name</Label>
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="first-name"
                                        name="first-name"
                                        placeholder="First Name"
                                        className=""
                                        autoComplete="new-password"
                                    />
                                )}
                            />
                            {errors.firstName && (
                                <p className="text-red-600 text-sm font-normal">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="last-name"
                                        name="last-name"
                                        placeholder="Last Name"
                                        className=""
                                        autoComplete="new-password"
                                    />
                                )}
                            />
                            {errors.lastName && (
                                <p className="text-red-600 text-sm font-normal">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="email"
                                        name="email"
                                        placeholder="Email"
                                        className=""
                                        autoComplete="new-password"
                                    />
                                )}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm font-normal">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <PasswordInput {...field} placeholder="Password" />
                                )}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm font-normal">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <PasswordInput {...field} placeholder="Confirm Password" />
                                )}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm font-normal">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="photo">Profile Photo</Label>
                            <Controller
                                name="photo"
                                control={control}
                                render={({ field }) => (
                                    <ImageUpload {...field} onChange={field.onChange} />
                                )}
                            />
                        </div>
                        {type === RegisterTypeEnum.DOCTOR && (
                            <>
                                <div className="grid gap-3">
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Controller
                                        name="specialization"
                                        control={control}
                                        rules={{ required: "Specialization is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(val) => {
                                                    const selected =
                                                        DOCTOR_SPECIALITIES.find(
                                                            (sp) => sp.value === val,
                                                        ) ?? null;
                                                    field.onChange(selected);
                                                }}
                                                value={field.value?.value ?? undefined}
                                            >
                                                <SelectTrigger className="w-full cursor-pointer">
                                                    <SelectValue
                                                        className="w-full"
                                                        placeholder="Select specialization"
                                                    />
                                                </SelectTrigger>

                                                <SelectContent className="w-full">
                                                    {DOCTOR_SPECIALITIES.map((speciality) => (
                                                        <SelectItem
                                                            className="w-full"
                                                            key={speciality.value}
                                                            value={speciality.value}
                                                        >
                                                            {speciality.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.specialization && (
                                        <p className="text-red-600 text-sm font-normal">
                                            {errors.specialization.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="experience">Experience</Label>
                                    <Controller
                                        name="experience"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="experience"
                                                name="experience"
                                                placeholder="Experience"
                                                maxLength={3}
                                                className=""
                                                autoComplete="new-password"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    field.onChange(value);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.experience && (
                                        <p className="text-red-600 text-sm font-normal">
                                            {errors.experience.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="education">Education</Label>
                                    <Controller
                                        name="education"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                id="education"
                                                name="education"
                                                placeholder="Education"
                                                className={cn(
                                                    "h-28 resize-none w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
                                                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                                    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                                                )}
                                                autoComplete="new-password"
                                                maxLength={1200}
                                            />
                                        )}
                                    />
                                    {errors.education && (
                                        <p className="text-red-600 text-sm font-normal">
                                            {errors.education.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="workingDays">Working Days</Label>
                                    {daysOfWeek.map((day) => (
                                        <Controller
                                            key={day}
                                            name={`workingHours.${day}` as const}
                                            control={control}
                                            render={({ field }) => {
                                                const isChecked = workingDays.includes(day);

                                                const toggleDay = () => {
                                                    const newDays = isChecked
                                                        ? workingDays.filter((d) => d !== day)
                                                        : [...workingDays, day];

                                                    setValue("workingDays", newDays, {
                                                        shouldValidate: true,
                                                    });

                                                    if (!isChecked) {
                                                        setValue(`workingHours.${day}`, {
                                                            start: "09:00",
                                                            end: "17:00",
                                                        });
                                                    } else {
                                                        setValue(`workingHours.${day}`, undefined);
                                                    }
                                                };

                                                return (
                                                    <div className="flex items-center justify-between border p-2 rounded-md">
                                                        <label className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onCheckedChange={toggleDay}
                                                            />
                                                            <span className="font-medium">{day}</span>
                                                        </label>

                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="time"
                                                                value={field.value?.start}
                                                                onChange={(e) =>
                                                                    field.onChange({
                                                                        ...field.value,
                                                                        start: e.target.value,
                                                                    })
                                                                }
                                                                className="border rounded-md p-1 w-24  dark:[&::-webkit-calendar-picker-indicator]:invert"
                                                            />
                                                            <span>to</span>
                                                            <input
                                                                type="time"
                                                                value={field.value?.end}
                                                                onChange={(e) =>
                                                                    field.onChange({
                                                                        ...field.value,
                                                                        end: e.target.value,
                                                                    })
                                                                }
                                                                className="border rounded-md p-1 w-24  dark:[&::-webkit-calendar-picker-indicator]:invert"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                    ))}
                                    {errors.workingDays && (
                                        <p className="text-red-600 text-sm font-normal">
                                            {errors.workingDays.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="contactInformation">
                                        Contact Information
                                    </Label>
                                    <Controller
                                        name="contactInformation"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                id="contactInformation"
                                                name="contactInformation"
                                                placeholder="Contact Information"
                                                className={cn(
                                                    "h-28 resize-none w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
                                                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                                    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                                                )}
                                                autoComplete="new-password"
                                                maxLength={500}
                                            />
                                        )}
                                    />
                                    {errors.contactInformation && (
                                        <p className="text-red-600 text-sm font-normal">
                                            {errors.contactInformation.message}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                        {type && (
                            <Button
                                type="submit"
                                className={`rounded-md px-4 py-2 ${theme === ThemeEnum.DARK ? "text-white" : "text-black"} cursor-pointer bg-cyan-800 hover:bg-cyan-800`}
                                disabled={isSubmitting}
                            >
                                Register
                            </Button>
                        )}
                    </div>
                </form>
                <div className="text-sm font-bold flex justify-center text-muted-foreground items-center gap-2"> Already have an account? <Link className=" inline-block text-white hover:underline" href={RouteEnum.LOGIN}> Sign in</Link></div>
            </Card>
        </div>
    );
};

export default RegisterForm;
