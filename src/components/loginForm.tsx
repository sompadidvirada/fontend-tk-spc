"use client";

import React, { useActionState, useEffect } from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { loginAction } from "@/app/(login)/login/action";
import { type ActionState } from "@/app/(login)/login/schema";
import { Alert } from "./ui/alert";
import { Ban } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { useStaffStore } from "@/store/staff";
import { useRouter } from "next/navigation";

const initialState: ActionState = { success: false, message: "" };

const LoginForms = () => {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  const router = useRouter();
  const setStaff = useStaffStore((state) => state.setStaff);


  useEffect(() => {
    if (state?.success && state?.userPayload) {
      if (!state.redirectPath) return;
      setStaff({
        id: state.userPayload.id,
        name: state.userPayload.name,
        phonenumber: state.userPayload.phone_number,
        role: state.userPayload.role,
        image: state.userPayload.image,
        birthdate: state.userPayload.birthdate,
        branchId: state.userPayload.branchId,
        branch_name: state.userPayload.branch_name
      });
      router.push(state.redirectPath);
    }
  }, [state, setStaff]);
  return (
    <form action={formAction} suppressHydrationWarning>
      <FieldGroup>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card font-lao text-[20px] text-center">
          ເຂົ້າສູ່ລະບົບ.
        </FieldSeparator>
        <Field>
          <FieldLabel htmlFor="phonenumber" className="font-lao">
            ເບີໂທລະສັບ
          </FieldLabel>
          <Input
            id="phonenumber"
            name="phone_number"
            type="text"
            placeholder="ເບີໂທຂອງທ່ານ"
            suppressHydrationWarning
            className="font-lao"
            required
          />
          {state.errors?.phone_number && (
            <Alert className="bg-red-600 text-white border-none py-2 flex flex-row items-center gap-2">
              <div>
                <Ban className="h-4 w-4 shrink-0" />
              </div>

              {/* Using a div instead of AlertTitle to avoid default component styles */}
              <div className="text-[12px] font-semibold leading-none py-0.5">
                {state.errors.phone_number[0]}
              </div>
            </Alert>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="font-lao">
              ລະຫັດຜ່ານ
            </FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline font-lao"
            >
              ລືມລະຫັດຜ່ານ ຂອງທ່ານ?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            placeholder="ໃສ່ລະຫັດຜ່ານ"
            type="password"
            suppressHydrationWarning
            required
            className="font-lao"
          />
          {state.errors?.password && (
            <Alert className="bg-red-600 text-white border-none py-2 flex flex-row items-center gap-2">
              <div>
                <Ban className="h-4 w-4 shrink-0" />
              </div>

              {/* Using a div instead of AlertTitle to avoid default component styles */}
              <div className="text-[12px] font-semibold leading-none py-0.5">
                {state.errors.password[0]}
              </div>
            </Alert>
          )}
        </Field>
        <Field>
          <Button
            type="submit"
            className="font-lao cursor-pointer"
            suppressHydrationWarning
            disabled={isPending}
          >
            {isPending ? <Spinner className="size-3" /> : "Login"}
          </Button>
          {state.message && !state.success && (
            <Alert className="bg-red-600 text-white border-none py-2 flex flex-row items-center gap-2">
              <div>
                <Ban className="h-4 w-4 shrink-0" />
              </div>

              {/* Using a div instead of AlertTitle to avoid default component styles */}
              <div className="text-[12px] font-semibold leading-none py-0.5">
                {state.message}
              </div>
            </Alert>
          )}
          <FieldDescription className="text-center font-lao">
            ຍັງບໍ່ມີຢູເຊີ? <a href="#">ຕິດຕໍ່ເພື່ອສ້າງ</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default LoginForms;
