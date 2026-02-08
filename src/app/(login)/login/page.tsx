import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-0 h-full w-full overflow-hidden">
        <Image
          src="/images/login-bg.jpg"
          alt="Coffee farm background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="rounded-xl bg-background/5 backdrop-blur-md shadow-lg p-6 border border-white/10">
          <LoginForm />
        </div>
      </div>
      <p className="absolute bottom-4 right-4 text-white text-[10px] opacity-80 md:text-xs font-lao z-20">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
}
