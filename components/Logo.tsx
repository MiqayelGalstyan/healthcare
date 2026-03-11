import { RouteEnum } from "@/types/enums";
import { Heart } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={RouteEnum.HOME} className="flex justify-center items-center">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
        <Heart
          width={25}
          height={25}
          className="inline-block"
          color={"white"}
        />
      </div>
      <p className="text-lg ml-3 font-bold text-muted-foreground">HealthCare</p>
    </Link>
  );
};

export default Logo;
