import { convertDay } from "@/helpers/convert-day";
import { prisma } from "@/lib/prisma";
import { RoleEnum } from "@/types/enums";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      photo,
      role,
      specialty,
      experience,
      education,
      workingDays,
      workingHours,
      bio,
    } = body;

    const typedWorkingDays = Array.isArray(workingDays) ? workingDays : [];

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { email },
    });
    if (existingPatient) {
      return NextResponse.json(
        { error: "Patient already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patientData: Record<string, unknown> = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      photo,
      role,
    };

    if (role === RoleEnum.DOCTOR) {
      patientData.doctorProfile = {
        create: {
          specialty: {
            connectOrCreate: {
              where: {
                name: specialty,
              },
              create: {
                name: specialty,
              },
            },
          },
          experience: experience ? Number(experience) : 0,
          education: education ?? "",
          bio: bio ?? "",
          price: 0,
          availabilities: {
            create:
              typedWorkingDays?.map((day) => ({
                dayOfWeek: convertDay(day),
                startTime: workingHours?.[day]?.start ?? "09:00",
                endTime: workingHours?.[day]?.end ?? "17:00",
              })) ?? [],
          },
        },
      };
    }

    const patient = await prisma.patient.create({
      data: patientData as unknown as Parameters<
        typeof prisma.patient.create
      >[0]["data"],
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
