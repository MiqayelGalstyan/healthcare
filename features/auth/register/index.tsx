"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { User, Stethoscope } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { RegisterTypeEnum, ThemeEnum } from "@/types/enums";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IRegisterPayload } from "@/types/interfaces/register";
import { registerSchema } from "@/helpers/register-helper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/PasswordInput";
import ImageUpload from "@/components/ImageUpload";

const RegisterForm = () => {
  const [currentType, setCurrentType] = useState<
    RegisterTypeEnum | undefined
  >();

  const { theme } = useTheme();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IRegisterPayload>({
    resolver: zodResolver(registerSchema(currentType!)),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      photo: "",
      specialization: "",
      experience: undefined,
      education: "",
      workingDays: [],
      workingHours: {},
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: IRegisterPayload) => {
    console.log("Form data:", data);
  };

  return (
    <div className="flex justify-between items-start gap-10">
      <Card className="flex-1 p-7 gap-3">
        <p className="text-2xl font-bold">Who are you?</p>
        <p className="text-sm text-muted-foreground">
          {!currentType
            ? "Please select your account type"
            : `You have selected ${currentType} account type`}
        </p>
        <div className="flex justify-between items-center mt-3">
          <div
            className={`p-6 border rounded-lg flex flex-col justify-center items-center gap-4 cursor-pointer ${
              currentType === RegisterTypeEnum.PATIENT
                ? "border-amber-50 border-2"
                : ""
            }`}
            onClick={() => setCurrentType(RegisterTypeEnum.PATIENT)}
          >
            <User
              width={60}
              height={60}
              color={theme === ThemeEnum.DARK ? "white" : "black"}
            />
            <p className="font-bold text-lg">I am patient</p>
          </div>
          <div
            className={`p-6 border rounded-lg flex flex-col justify-center items-center gap-4 cursor-pointer ${currentType === RegisterTypeEnum.DOCTOR ? "border-amber-50 border-2" : ""}`}
            onClick={() => setCurrentType(RegisterTypeEnum.DOCTOR)}
          >
            <Stethoscope
              width={60}
              height={60}
              color={theme === ThemeEnum.DARK ? "white" : "black"}
            />
            <p className="font-bold text-lg">I am doctor</p>
          </div>
        </div>
      </Card>
      <Card className="flex-2 p-6">
        <CardTitle>
          {!currentType
            ? "Please select account type to proceed"
            : currentType === RegisterTypeEnum.PATIENT
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
              <Controller
                name="photo"
                control={control}
                render={({ field }) => (
                  <ImageUpload {...field} onChange={field.onChange} />
                )}
              />
            </div>
            {currentType === RegisterTypeEnum.DOCTOR && (
              <>
                <div className="grid gap-3">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Controller
                    name="specialization"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="specialization"
                        name="specialization"
                        placeholder="Specialization"
                        className=""
                        autoComplete="new-password"
                      />
                    )}
                  />
                  {errors.specialization && (
                    <p className="text-red-600 text-sm font-normal">
                      {errors.specialization.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterForm;
