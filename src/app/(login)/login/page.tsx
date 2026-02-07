import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-svh overflow-hidden flex-1">
      {/* Background image */}
      <Image
        src="/images/login-bg.jpg"
        alt="Coffee farm background"
        fill
        priority
        className="object-cover pointer-events-none select-none"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-xl bg-background/5 backdrop-blur shadow-lg p-6 flex flex-col gap-6">
          <LoginForm />
        </div>
      </div>
       {/* Footer text */}
      <p className="absolute bottom-4 right-4 text-white text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
}
