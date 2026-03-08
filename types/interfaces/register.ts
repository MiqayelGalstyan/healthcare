export interface IRegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  photo?: string;
  specialization?: string;
  experience?: number;
  education?: string;
  workingDays?: string[];
  workingHours?: { [day: string]: { start: string; end: string } };
}
