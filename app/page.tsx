import { authOptions } from "@/lib/auth";
import { RoleEnum, RouteEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(RouteEnum.LOGIN);
  }

  redirect(
    session.user.role === RoleEnum.PATIENT
      ? RouteEnum.PATIENT
      : RouteEnum.DASHBOARD,
  );
}
