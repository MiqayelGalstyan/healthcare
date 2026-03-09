import { DefaultSession, DefaultUser } from "next-auth";
import { RoleEnum } from "./enums";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: RoleEnum;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        role: RoleEnum;
    }
}