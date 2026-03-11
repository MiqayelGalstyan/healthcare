import { Check, X } from "lucide-react";

interface Props {
  valid: boolean;
  text: string;
}

const Rule = ({ valid, text }: Props) => {
  return (
    <div className="flex items-center justify-start gap-2 text-sm">
      {valid ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      )}
      <p
        className={`text-xs ${valid ? "text-green-600" : "text-muted-foreground"}`}
      >
        {text}
      </p>
    </div>
  );
};

export default Rule;
