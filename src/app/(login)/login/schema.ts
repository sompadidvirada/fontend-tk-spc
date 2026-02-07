// app/(auth)/login/schema.ts
import { z } from "zod";

export const LoginSchema = z.object({
  // Use .email() correctly as a method, not a property
  phone_number: z.string().min(8,"example phone number '51235123'").max(8, "The phone number much be 8 digit '51235123'"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export type ActionState = {
  success: boolean;
  message: string;
  redirectPath?: string; // Add the '?' here
  errors?: {
    phone_number?: string[];
    password?: string[];
  };
  userPayload?: {
    id: string;
    name: string
    phone_number: string;
    role: string;
    image?: string;
    birthdate: string;
    branchId: number | null;
    branch_name: string | null
  };
};