import Features from "@/components/features";
import { Hero } from "@/components/hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-w-screen min-h-screen flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center h-screen p-5 relative">
        <Hero />
      </div>
      <Features />
    </div>
  );
}


