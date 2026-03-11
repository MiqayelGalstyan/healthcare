"use client";

import { RouteEnum } from "@/types/enums";
import { Calendar, MapPin, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export interface DoctorCardProps {
  id: string;
  name: string;
  image?: string | null;
  specialty: string;
  rating: number;
  experience: number;
}

const DoctorCard = ({
  id,
  name,
  image,
  specialty,
  rating,
  experience,
}: DoctorCardProps) => {
  const router = useRouter();

  const onNavigate = () => {
    router.push(`${RouteEnum.DOCTORS}/${id}`);
  };

  return (
    <div
      className="bg-white dark:bg-card rounded-xl shadow-md overflow-hidden cursor-pointer border border-border"
      onClick={onNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onNavigate?.()}
    >
      <div className="h-48 overflow-hidden bg-muted">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No photo
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-1">
          {name}
        </h3>
        <p className="text-blue-600 text-sm font-medium mb-3">{specialty}</p>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
          <span className="text-sm font-medium text-gray-900 dark:text-foreground">
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-muted-foreground mb-4">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>
            {experience} {experience === 1 ? "year" : "years"} experience
          </span>
        </div>

        <button
          type="button"
          className="w-full cursor-pointer bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.();
          }}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
