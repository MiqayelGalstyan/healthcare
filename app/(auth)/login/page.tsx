import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/features/auth/login";
import { authOptions } from "@/lib/auth";
import { RoleEnum, RouteEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(
      session?.user?.role === RoleEnum.PATIENT
        ? RouteEnum.PATIENT
        : RouteEnum.DASHBOARD,
    );
  }

  return (
    <div className={"flex flex-col justify-center items-center h-dvh gap-6"}>
      <Card className="overflow-hidden p-0 w-full max-w-5xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <LoginForm />
          <div className="bg-muted flex justify-center items-center min-h-125">
            <Image
              src={"/login.png"}
              alt="Logo"
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
