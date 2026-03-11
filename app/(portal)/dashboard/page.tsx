import { authOptions } from "@/lib/auth";
import { RouteEnum } from "@/types/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(RouteEnum.LOGIN);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-lg text-gray-600">This is your dashboard page.</p>
    </div>
  );
}
