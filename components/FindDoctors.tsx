"use client";

import { useState } from "react";
import DoctorCard from "./DoctorCard";
import { getPublicAvatarUrl } from "@/lib/supabaseStorage";
import { IFoundDoctor } from "@/types/interfaces/doctor";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DOCTOR_SPECIALITIES } from "@/constants";
import { X } from "lucide-react";

interface Props {
  doctors: IFoundDoctor[];
}

const FindDoctors = ({ doctors }: Props) => {
  const [filteredDoctors, setFilteredDoctors] =
    useState<IFoundDoctor[]>(doctors);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    const filtered = doctors.filter(
      (doctor) =>
        doctor.patient.firstName
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        doctor.patient.lastName
          .toLowerCase()
          .includes(searchValue.toLowerCase()),
    );
    setSearch(searchValue);
    setFilteredDoctors(filtered);
  };

  const handleSpecialtyChange = (val: string) => {
    const selected = DOCTOR_SPECIALITIES.find((sp) => sp.value === val) ?? null;
    setSpecialty(selected?.value ?? null);

    const filtered = doctors.filter(
      (doctor) => doctor.specialty.name === selected?.value,
    );
    setFilteredDoctors(filtered);
  };

  const onReset = () => {
    setSpecialty(null);
    setFilteredDoctors(doctors);
    setSearch("");
  };

  return (
    <>
      <div className="flex justify-start items-center gap-2 mb-6 max-w-2xl">
        <Input
          type="text"
          placeholder="Search doctors"
          onChange={handleSearch}
          className="w-full"
          value={search}
        />
        <Select
          key={specialty ?? "none"}
          onValueChange={(val) => handleSpecialtyChange(val)}
          value={specialty ?? undefined}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue
              className="w-full"
              placeholder="Select specialization"
            />
          </SelectTrigger>

          <SelectContent className="w-full">
            {DOCTOR_SPECIALITIES.map((speciality) => (
              <SelectItem
                className="w-full"
                key={speciality.value}
                value={speciality.value}
              >
                {speciality.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || specialty) && (
          <div className="rounded-full bg-muted p-2" onClick={() => onReset()}>
            <X size={20} className="cursor-pointer" />
          </div>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            id={doctor.id}
            name={`${doctor.patient.firstName} ${doctor.patient.lastName}`}
            image={getPublicAvatarUrl(doctor.patient.photo)}
            specialty={doctor.specialty.name}
            rating={doctor.rating}
            experience={doctor.experience}
          />
        ))}
      </div>
      {filteredDoctors.length === 0 && (
        <p className="text-muted-foreground">No doctors found.</p>
      )}
    </>
  );
};

export default FindDoctors;
