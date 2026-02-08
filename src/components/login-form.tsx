import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  FieldDescription,
} from "@/components/ui/field";
import Image from "next/image";
import LoginForms from "./loginForm";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="justify-center">
          <Image
            src="/images/TK.png"
            alt="Treekoff logo"
            priority
            width={150}
            height={30}
            className="pointer-events-none select-none"
          />
        </CardHeader>
        <CardContent>
         <LoginForms />
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-white text-[12px]">
        By clicking continue, you agree to our{" "}
        <a
          href="/termsofservice"
          className="text-white! hover:text-gray-400! transition-colors duration-200"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacypolicy"
          className="text-white! hover:text-gray-400! transition-colors duration-200"
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
