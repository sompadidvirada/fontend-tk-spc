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
            <CardTitle className="text-2xl font-lao">Privacy Policy</CardTitle>
            <CardDescription className="text-white/70 font-lao">
              Last updated: January 2026
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-sm leading-relaxed font-lao">
            <p>
              This Privacy Policy explains how <strong>Sompadid Virada</strong>{" "}
              collects, uses, and protects your personal information when you
              use our website, application, and services (collectively, the
              “Service”).
            </p>

            <h2 className="text-base font-semibold">
              1. Information We Collect
            </h2>
            <p>
              We may collect personal information such as your name, email
              address, phone number, account credentials, and usage data when
              you register, log in, or interact with the Service.
            </p>

            <h2 className="text-base font-semibold">
              2. How We Use Information
            </h2>
            <p>
              The information we collect is used to provide, maintain, and
              improve our Service, process transactions, communicate with users,
              and ensure system security.
            </p>

            <h2 className="text-base font-semibold">3. Data Protection</h2>
            <p>
              We implement reasonable technical and organizational measures to
              protect your personal information from unauthorized access, loss,
              misuse, or disclosure.
            </p>

            <h2 className="text-base font-semibold">
              4. Sharing of Information
            </h2>
            <p>
              We do not sell or rent your personal information to third parties.
              Information may be shared only when required by law or to operate
              essential service features.
            </p>

            <h2 className="text-base font-semibold">5. Cookies & Tracking</h2>
            <p>
              We may use cookies or similar technologies to enhance user
              experience, analyze usage patterns, and improve functionality. You
              may disable cookies through your browser settings.
            </p>

            <h2 className="text-base font-semibold">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal
              information. You may also request limitations on how your data is
              used.
            </p>

            <h2 className="text-base font-semibold">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Continued use
              of the Service after changes indicates acceptance of the revised
              policy.
            </p>

            <h2 className="text-base font-semibold">8. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us through official channels provided by Sompadid
              Virada. email: sompadidppp@gmail.com
            </p>
          </CardContent>

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
