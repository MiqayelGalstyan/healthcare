import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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

    onChange(file.name);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleButtonClick}
        className="px-4 py-2 bg-cyan-800 cursor-pointer text-white rounded-md hover:bg-cyan-800"
      >
        Upload Image
      </button>
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
