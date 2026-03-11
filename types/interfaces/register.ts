export interface IRegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  photo: string;
  specialty?: null | { value: string; label: string };
  experience?: string;
  education?: string;
  workingDays?: string[];
  workingHours?: { [day: string]: { start: string; end: string } };
  bio?: string;
}
