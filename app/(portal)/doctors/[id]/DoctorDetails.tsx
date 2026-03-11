"use client";

import { Award, GraduationCap, Star } from "lucide-react";
import { Booking } from "@/components/Booking";
import { IFoundDoctor } from "@/types/interfaces/doctor";
import { getPublicAvatarUrl } from "@/lib/supabaseStorage";
import { Availability } from "@prisma/client";
import { useTheme } from "@/hooks/useTheme";
import { ThemeEnum } from "@/types/enums";

interface Props {
  doctor: IFoundDoctor & { availabilities: Availability[] };
}

const DoctorDetails = ({ doctor }: Props) => {
  const imageUrl = getPublicAvatarUrl(doctor.patient.photo);
  const fullName = `${doctor.patient.firstName} ${doctor.patient.lastName}`;

  const { theme } = useTheme();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div
              className={`rounded-2xl shadow-md overflow-hidden sticky top-8 bg-white dark:bg-card`}
            >
              <div className="h-80 overflow-hidden">
                <img
                  src={imageUrl as string}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <h1
                  className={`text-2xl font-bold ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"} mb-2`}
                >
                  {fullName}
                </h1>
                <p className="text-blue-600 font-medium mb-4">
                  <span
                    className={`${theme === ThemeEnum.LIGHT ? "text-muted-foreground" : "text-white"}  font-semibold`}
                  >
                    specialty
                  </span>{" "}
                  - {doctor?.specialty?.name}{" "}
                </p>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span
                    className={`font-semibold ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"}`}
                  >
                    {doctor.rating.toFixed()} rating
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Award className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span
                      className={`text-sm ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"}`}
                    >
                      {doctor.experience} years experience
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span
                      className={`text-sm ${theme === ThemeEnum.LIGHT ? "text-gray-900" : "text-white"}`}
                    >
                      {doctor.education} education
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p
                    className={`text-sm ${theme === ThemeEnum.LIGHT ? "text-gray-600" : "text-white"} leading-relaxed`}
                  >
                    {doctor.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Booking
            doctorId={doctor.id}
            availableSlots={doctor.availabilities}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
