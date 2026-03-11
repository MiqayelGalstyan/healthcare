export interface IFoundDoctor {
  patient: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    photo: string | null;
  };
  specialty: {
    name: string;
    id: string;
  };
  id: string;
  patientId: string;
  rating: number;
  bio: string | null;
  experience: number;
  education: string | null;
  price: number;
  specialtyId: string;
}
