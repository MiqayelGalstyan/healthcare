import { DefaultSession, DefaultUser } from "next-auth";
import { RoleEnum } from "./enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RoleEnum;
      firstName: string;
      lastName: string;
      photo?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: RoleEnum;
    firstName: string;
    lastName: string;
    photo?: string;
    email: string;
  }
}
