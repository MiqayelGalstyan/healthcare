import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RoleEnum, RouteEnum } from "@/types/enums";

const ROLE_HOME: Record<RoleEnum, string> = {
  [RoleEnum.ADMIN]: RouteEnum.ADMIN,
  [RoleEnum.DOCTOR]: RouteEnum.DOCTOR,
  [RoleEnum.PATIENT]: RouteEnum.PATIENT,
} as const;

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role as RoleEnum | undefined;
  const roleHome = role ? ROLE_HOME[role] : undefined;

  const isProtected =
    pathname.startsWith(RouteEnum.DASHBOARD) ||
    pathname.startsWith(RouteEnum.ADMIN) ||
    pathname.startsWith(RouteEnum.DOCTOR) ||
    pathname.startsWith(RouteEnum.PATIENT);

  if (isProtected && !token) {
    const loginUrl = new URL(RouteEnum.LOGIN, req.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(RouteEnum.DOCTORS)) {
    if (!token) {
      const loginUrl = new URL(RouteEnum.LOGIN, req.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== RoleEnum.PATIENT && roleHome) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }
  }

  if (pathname.startsWith(RouteEnum.LOGIN) && token && roleHome) {
    return NextResponse.redirect(new URL(roleHome, req.url));
  }

  if (token && roleHome) {
    if (pathname.startsWith(RouteEnum.ADMIN) && role !== RoleEnum.ADMIN) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }
    if (
      pathname.startsWith(RouteEnum.DOCTOR) &&
      !pathname.startsWith(RouteEnum.DOCTORS) &&
      role !== RoleEnum.DOCTOR
    ) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }
    if (pathname.startsWith(RouteEnum.PATIENT) && role !== RoleEnum.PATIENT) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
    "/doctor/:path*",
    "/doctors",
    "/doctors/:path*",
    "/patient/:path*",
  ],
};
