"use client";

import { useState } from "react";
import RegisterForm from "@/features/auth/register";
import { RegisterTypeEnum, RoleEnum, ThemeEnum } from "@/types/enums";
import { User, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { IRegisterPayload } from "@/types/interfaces/register";
import { toast } from "sonner";

const RegistrationFormWrapper = () => {
  const [currentType, setCurrentType] = useState<RegisterTypeEnum>(
    RegisterTypeEnum.PATIENT,
  );

  const { theme } = useTheme();

  const actualBorderColor =
    theme === ThemeEnum.DARK
      ? "border-amber-50 border-2"
      : "border-amber-600 border-2";

  const onSubmit = async (data: IRegisterPayload) => {
    try {
      const formData = {
        ...data,
        role:
          currentType === RegisterTypeEnum.DOCTOR
            ? RoleEnum.DOCTOR
            : RoleEnum.PATIENT,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await res.json();

      if (!res.ok) {
        const error =
          responseData?.error ||
          "Something went wrong during registration. Please try again.";

        const errorMessage =
          typeof error === "string" ? error : "An unknown error occurred.";
        toast.error(errorMessage);
        return;
      }
      toast.success("Registration successful!");
    } catch (error) {
      console.log(error, "onSubmit error");
    }
  };

  return (
    <>
      <RegisterForm type={currentType} onSubmit={onSubmit}>
        <Card className="flex-1 p-[10px] lg:p-7 gap-3">
          <p className="text-xl font-bold">Who are you?</p>
          <p className="text-sm text-muted-foreground">
            {`You have selected ${currentType} account type`}
          </p>
          <div className="flex justify-between items-center mt-3">
            <div
              className={`p-[10px] lg:p-6 border rounded-lg flex flex-col justify-center items-center gap-4 cursor-pointer ${
                currentType === RegisterTypeEnum.PATIENT
                  ? actualBorderColor
                  : ""
              }`}
              onClick={() => setCurrentType(RegisterTypeEnum.PATIENT)}
            >
              <User
                width={60}
                height={60}
                className="w-[30px] h-[30px] lg:w-[60px] lg:h-[60px]"
                color={theme === ThemeEnum.DARK ? "white" : "black"}
              />
              <p className="text-center font-bold text-xs lg:text-sm xl:text-lg">
                I am patient
              </p>
            </div>
            <div
              className={`p-[10px] lg:p-6 border rounded-lg flex flex-col justify-center items-center gap-4 cursor-pointer ${
                currentType === RegisterTypeEnum.DOCTOR ? actualBorderColor : ""
              }`}
              onClick={() => setCurrentType(RegisterTypeEnum.DOCTOR)}
            >
              <Stethoscope
                width={60}
                height={60}
                className="w-[30px] h-[30px] lg:w-[60px] lg:h-[60px]"
                color={theme === ThemeEnum.DARK ? "white" : "black"}
              />
              <p className="text-center font-bold text-xs lg:text-sm xl:text-lg">
                I am doctor
              </p>
            </div>
          </div>
        </Card>
      </RegisterForm>
    </>
  );
};

export default RegistrationFormWrapper;
