import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
    const { email, password, role } = await req.json()

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
            role,
        },
    })

    return Response.json(user)
}