import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { RoleEnum } from "@/types/enums";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const patient = await prisma.patient.findUnique({
          where: { email: credentials.email },
        });

        if (!patient) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          patient.password,
        );
        if (!valid) return null;

        return {
          id: patient.id,
          email: patient.email,
          role: RoleEnum[patient.role as keyof typeof RoleEnum],
          firstName: patient.firstName,
          lastName: patient.lastName,
          photo: patient.photo || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName as string;
        token.lastName = user.lastName as string;
        token.photo = user.photo as string;
        token.email = user.email as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as RoleEnum;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.photo = token.photo as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};
