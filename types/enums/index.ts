export enum RoleEnum {
  PATIENT = "PATIENT",
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
}

export enum RouteEnum {
  HOME = "/",
  LOGIN = "/login",
  DASHBOARD = "/dashboard",
  PROFILE = "/profile",
  SIGNUP = "/register",
  ADMIN = "/admin",
  DOCTOR = "/doctor",
  PATIENT = "/patient",
  PATIENT_DOCTOR = "/patient/doctor",
  PATIENT_APPOINTMENT_CONFIRMED = "/patient/appointment-confirmed",
  DOCTORS = "/doctors",
}

export enum ThemeEnum {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum RegisterTypeEnum {
  PATIENT = "patient",
  DOCTOR = "doctor",
}
