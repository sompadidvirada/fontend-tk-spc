import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    // Change min-h-svh to h-svh to lock it to the viewport height
    <div className="relative h-svh w-full overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background image - ensure it is fixed or absolute to the full viewport */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/login-bg.jpg"
          alt="Coffee farm background"
          fill
          priority
          // 'object-center' helps keep the subject of the photo visible on skinny mobile screens
          className="object-cover object-center pointer-events-none select-none"
        />
        {/* Dark overlay inside the same container as the image */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="rounded-xl bg-background/5 backdrop-blur-md shadow-lg p-6 border border-white/10">
          <LoginForm />
        </div>
      </div>

      {/* Footer text */}
      <p className="absolute bottom-4 right-4 text-white text-[10px] opacity-80 md:text-xs font-lao z-20">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
}
