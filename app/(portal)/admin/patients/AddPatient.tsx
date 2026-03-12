"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import RegisterForm from "@/features/auth/register";
import { RegisterTypeEnum, RoleEnum } from "@/types/enums";
import { IRegisterPayload } from "@/types/interfaces/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddPatient = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const onSubmit = async (data: IRegisterPayload) => {
    try {
      const formData = {
        ...data,
        role: RoleEnum.PATIENT,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await res.json();

      if (!res.ok) {
        const error =
          responseData?.error ||
          "Something went wrong during registration. Please try again.";

        const errorMessage =
          typeof error === "string" ? error : "An unknown error occurred.";
        toast.error(errorMessage);
        return;
      }
      setOpen(false);
      router.refresh();
      toast.success("Registration successful!");
    } catch (error) {
      console.log(error, "onSubmit error");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Add Patient
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle className="hidden" />
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <RegisterForm
            cardStyles="bg-transparent border-none p-0"
            type={RegisterTypeEnum.PATIENT}
            isSignInButtonVisible={false}
            onSubmit={onSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddPatient;
