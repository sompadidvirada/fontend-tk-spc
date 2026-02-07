import Image from "next/image";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
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
      <div className="relative z-10 px-6 py-16">
        <Card className="mx-auto w-full max-w-4xl bg-background/10 backdrop-blur-2xl border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-lao">Terms of Service</CardTitle>
            <CardDescription className="text-white/70 font-lao">
              Last updated: January 2026
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed font-lao">
            <p>
              Welcome to <strong>Sompadid Virada</strong>. By accessing or using
              our website, application, or services (collectively, the
              “Service”), you agree to be bound by these Terms of Service.
            </p>

            <h2 className="text-base font-semibold">1. Use of the Service</h2>
            <p>
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. You must not misuse or attempt to
              disrupt the Service.
            </p>

            <h2 className="text-base font-semibold">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities under your account.
            </p>

            <h2 className="text-base font-semibold">
              3. Intellectual Property
            </h2>
            <p>
              All content, trademarks, and materials provided through the
              Service are owned by Sompadid Virada and protected by applicable
              laws.
            </p>

            <h2 className="text-base font-semibold">4. Service Availability</h2>
            <p>
              We may modify, suspend, or discontinue any part of the Service at
              any time without notice.
            </p>

            <h2 className="text-base font-semibold">
              5. Limitation of Liability
            </h2>
            <p>
              Sompadid Virada shall not be liable for any indirect or
              consequential damages arising from your use of the Service.
            </p>

            <h2 className="text-base font-semibold">6. Changes</h2>
            <p>
              Continued use of the Service after updates constitutes acceptance
              of the revised Terms.
            </p>

            <h2 className="text-base font-semibold">7. Governing Law</h2>
            <p>These Terms are governed by applicable local laws.</p>
          </CardContent>{" "}
          {/* Back to Login */}
          <CardAction className="self-end mr-5">
            <Button asChild variant="default" className="hover:bg-white/10">
              <Link href="/login">← Back to Login</Link>
            </Button>
          </CardAction>
        </Card>
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 right-4 text-white text-[12px] opacity-80 font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
};

export default Page;
