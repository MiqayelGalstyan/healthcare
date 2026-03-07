import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions = {
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials) return null
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })
                if (!user) return null

                const valid = await bcrypt.compare(credentials.password, user.password)
                if (!valid) return null

                return user
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }: { token: Record<string, never>; user: Record<string, never> }) {
            if (user) token.role = user.role
            return token
        },
        async session({ session, token }: { session: Record<string, Record<string, unknown>>; token: Record<string, never> }) {
            if (session.user) session.user.role = token.role
            return session
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
}