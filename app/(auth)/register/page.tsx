import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegistrationFormWrapper from "./RegistrationFormWrapper";

export default function Register() {
  return (
    <Card className="overflow-hidden w-full max-w-7xl mx-auto my-10 sm:my-16 p-2 sm:px-6 sm:py-10">
      <CardHeader>
        <CardTitle className="text-3xl">Register a new account</CardTitle>
      </CardHeader>
      <CardContent>
        <RegistrationFormWrapper />
      </CardContent>
    </Card>
  );
}
