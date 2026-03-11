import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      richColors
      toastOptions={{
        classNames: {
          success: "bg-green-500 text-white",
          error: "bg-red-600 text-white",
          warning: "bg-yellow-500 text-black",
          info: "bg-blue-500 text-white",
        },
      }}
    />
  );
}
