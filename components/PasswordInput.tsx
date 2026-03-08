import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { ThemeEnum } from "@/types/enums";
import { useTheme } from "@/hooks/useTheme";

const PasswordInput = ({
  ...inputProps
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { theme } = useTheme();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="grid gap-2">
      <div className="relative">
        <Input
          {...inputProps}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          autoCorrect="off"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? (
            <EyeOff
              size={20}
              color={theme === ThemeEnum.DARK ? "white" : "black"}
            />
          ) : (
            <Eye
              size={20}
              color={theme === ThemeEnum.DARK ? "white" : "black"}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
