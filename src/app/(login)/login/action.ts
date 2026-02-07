// app/(auth)/login/action.ts
"use server";

import { redirect } from "next/navigation";
import { LoginSchema, type ActionState } from "./schema";
import axios from "axios";
import { createSession, decrypt } from "@/app/(lib)/session";
import { cookies, headers } from "next/headers";
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function loginAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = LoginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { phone_number, password } = validatedFields.data;

  let targetPath = "/login";
  let userPayload = null;

  try {
    const response = await axios.post(
      `${URL}/authentication/login`,
      {
        phoen_number: phone_number,
        password: password,
      },
      { withCredentials: true },
    );

    const cookieHeader = response.headers["set-cookie"];
    console.log("COOKIES FROM BACKEND:", response);

    if (cookieHeader) {
      const cookieStore = await cookies();
      const cookieString = cookieHeader[0];
      const [nameValue] = cookieString.split(";");
      const [name, value] = nameValue.split("=");
      const isProd = process.env.NODE_ENV === "production";

      cookieStore.set(name.trim(), value.trim(), {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 20 * 60 * 60,
      });

      const { user } = response.data;
      userPayload = user; // Store user data for the return

      // --- Logic for targetPath ---
      const role = user.role;
      if (role === "ADMIN") {
        targetPath = "/admin";
      } else if (["STAFF_SPC", "STAFF_TK", "STAFF_WH"].includes(role)) {
        targetPath = "/staffoffice";
      } else if (role === "BARISTAR") {
        targetPath = "/staffbaristar";
      }
    } else {
      throw new Error("No session received from server");
    }
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    return { success: false, message: "ເບີໂທ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ" };
  }

  // Final return is OUTSIDE the try/catch block
  return {
    success: true,
    message: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
    userPayload: userPayload,
    redirectPath: targetPath,
  };
}

export async function updateStaffProfile(formData: FormData, id: number) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  const response = await axios.put(
    `${URL}/baristar/updatebaristar/${id}`,
    formData,
    {
      withCredentials: true,
      headers: {
        Cookie: `session=${sessionToken}`,
      },
    },
  );

  const cookieHeader = response.headers["set-cookie"];
  if (cookieHeader) {
    const cookieStore = await cookies();
    const [nameValue] = cookieHeader[0].split(";");
    const [name, value] = nameValue.split("=");

    // Forward the cookie from Express to the Browser
    cookieStore.set(name.trim(), value.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 20 * 60 * 60,
    });
  }
  return response.data;
}
