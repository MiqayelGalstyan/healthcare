import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white font-sans">
      <p className="font-bold text-black text-2xl text-center">Home</p>
      <Button variant={'outline'} className="pointer-events-auto">Click</Button>
    </div>
  );
}
