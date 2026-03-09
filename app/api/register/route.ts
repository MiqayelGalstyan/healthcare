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
      specialization,
      experience,
      education,
      workingDays,
      workingHours,
      contactInformation,
    } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: Record<string, unknown> = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      photo,
      role,
    }

    if (role === RoleEnum.DOCTOR) {
      userData.doctorProfile = {
        create: {
          specialization: specialization?.value ?? "",
          experience: experience ? Number(experience) : 0,
          education: education ?? "",
          workingDays: workingDays ?? [],
          workingHours: workingHours ?? {},
          contactInfo: contactInformation ?? "",
        },
      }
    }

    const user = await prisma.user.create({
      data: userData as unknown as Parameters<typeof prisma.user.create>[0]["data"],
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

}