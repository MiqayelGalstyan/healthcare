"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/helpers/login-helper";
import { ILoginPayload } from "@/types/interfaces/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ThemeEnum } from "@/types/enums";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { theme } = useTheme();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = (data: ILoginPayload) => {
    console.log(data);
  };

  return (
    <Card className="border-none shadow-none pt-16 pb-16 w-full pl-10 pr-10">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    name="login-email"
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative w-full flex flex-col justify-center items-center">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pr-8 "
                      autoComplete="new-password"
                    />
                  )}
                />
                {showPassword ? (
                  <EyeOff
                    className="absolute right-2 cursor-pointer select-none"
                    width={20}
                    height={20}
                    onClick={toggleShowPassword}
                    color={theme === ThemeEnum.DARK ? "white" : "black"}
                  />
                ) : (
                  <Eye
                    className="absolute right-2 cursor-pointer select-none"
                    width={20}
                    height={20}
                    onClick={toggleShowPassword}
                    color={theme === ThemeEnum.DARK ? "white" : "black"}
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm font-normal">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            variant="outline"
            className="w-full cursor-pointer mt-8"
            disabled={!!errors.email || !!errors.password}
          >
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Button className="p-0 cursor-pointer" variant="link">
            Sign Up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
