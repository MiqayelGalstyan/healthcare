import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";

interface Props {
  onChange: (filePath: string) => void;
}

const ImageUpload = ({ onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) throw error;

    onChange(fileName);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        onClick={handleButtonClick}
        className="px-4 py-2 rounded-md cursor-pointer"
      >
        Upload Image
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      {preview && (
        <div className="relative">
          <Image
            src={preview}
            alt="Preview"
            width={128}
            height={128}
            className="object-cover w-full rounded-md border mt-2"
          />
          <X
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setPreview(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
