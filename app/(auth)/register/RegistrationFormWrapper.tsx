"use client";

import { useState } from "react";
import RegisterForm from "@/features/auth/register";
import { RegisterTypeEnum, RoleEnum, ThemeEnum } from "@/types/enums";
import { User, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { IRegisterPayload } from "@/types/interfaces/register";
import { toast } from "sonner"

const RegistrationFormWrapper = () => {
    const [currentType, setCurrentType] = useState<RegisterTypeEnum>(RegisterTypeEnum.PATIENT);

    const { theme } = useTheme();

    const onSubmit = async (data: IRegisterPayload) => {
        try {
            const formData = {
                ...data,
                role: currentType === RegisterTypeEnum.DOCTOR ? RoleEnum.DOCTOR : RoleEnum.USER
            }

            const res = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });

            const responseData = await res.json();

            if (!res.ok) {
                toast.error("Something went wrong during registration. Please try again.");
                return;
            }
            console.log("Success:", responseData);
            toast.success("Registration successful!");
            
        } catch (error) {
            console.log(error, 'onSubmit error')
        }
    };

    return (
        <>
            <RegisterForm type={currentType} onSubmit={onSubmit}>
                <Card className="flex-1 p-7 gap-3">
                    <p className="text-xl font-bold">Who are you?</p>
                    <p className="text-sm text-muted-foreground">
                        {`You have selected ${currentType} account type`}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                        <div
                            className={`p-6 border rounded-lg flex flex-col justify-center items-center gap-4 cursor-pointer ${currentType === RegisterTypeEnum.PATIENT
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
            </RegisterForm>
        </>
    );
};

export default RegistrationFormWrapper;
