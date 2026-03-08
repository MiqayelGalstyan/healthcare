import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/features/auth/register";

export default function Register() {
  return (
    <Card className="overflow-hidden p-10 w-full max-w-7xl m-auto mt-20  h-full">
      <CardHeader>
        <CardTitle className="text-3xl">Register a new account</CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
