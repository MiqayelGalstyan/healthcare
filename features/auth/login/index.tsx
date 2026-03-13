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
import { RoleEnum, RouteEnum } from "@/types/enums";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

const LoginForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ILoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: ILoginPayload) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!result?.ok) {
        return;
      }

      const session = await getSession();

      const route =
        session?.user?.role === RoleEnum.PATIENT
          ? RouteEnum.PATIENT
          : RouteEnum.DASHBOARD;
      router.push(route);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const navigateToSignUp = () => {
    router.push(RouteEnum.SIGNUP);
  };

  return (
    <Card className="border-none shadow-none w-full max-w-md mx-auto px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-16">
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
              <div className="relative w-full">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput {...field} placeholder="Password" />
                  )}
                />
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
            disabled={!!errors.email || !!errors.password || isSubmitting}
          >
            {isSubmitting ? "Please wait..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Button
            className="p-0 cursor-pointer"
            variant="link"
            onClick={navigateToSignUp}
          >
            Sign Up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
