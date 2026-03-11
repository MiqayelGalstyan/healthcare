import { RouteEnum } from "@/types/enums";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppointmentConfirmedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div
          className="mx-auto w-28 h-20 rounded-lg border-2 border-green-600 bg-green-50 dark:bg-green-950/40 flex items-center justify-center shadow-md relative overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-green-600 bg-white dark:bg-card flex items-center justify-center shadow-inner">
              <Check className="w-8 h-8 text-green-600 stroke-[2.5]" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Appointment confirmed
          </h1>
          <p className="text-muted-foreground text-sm">
            Your appointment has been successfully booked. You will receive a
            reminder before your visit.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild className="cursor-pointer">
            <Link href={RouteEnum.PATIENT}>Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="cursor-pointer">
            <Link href={RouteEnum.DOCTORS}>Find another doctor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
